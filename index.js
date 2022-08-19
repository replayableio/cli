#!/usr/bin/env node

const args = require("yargs").argv;
const ipc = require("node-ipc").default;

ipc.config.id = "replayable-cli";
ipc.config.retry = 1500;
ipc.config.silent = true;

// args:
// private=anything (boolean) - don't expose share link
// format=(link|md) - return format
// image=(gif|png) - embedded image format, only if md is true

const pngUrl = function (data) {
  let url = `${data.API_ENDPOINT}/replay/${
    data.replay.id
  }/screenshot${shareQuery(data)}`;
  return url;
};

const gifUrl = function (data) {
  let url = `${data.API_ENDPOINT}/replay/${data.replay.id}/gif${shareQuery(
    data
  )}`;
  return url;
};

const imageUrl = function (data) {
  if (args.image == "png") {
    return pngUrl(data);
  } else {
    return gifUrl(data);
  }
};

const shareLink = function (data) {
  return `${data.WEB_URL}/replay/${data.replay.id}/${shareQuery(data)}`;
};

const shareQuery = function (data) {
  return args.private ? "" : `?share=${data.replay.shareKey}`;
};

const markdownPreview = function (data) {
  return `[![${data.replay.title}](${imageUrl(data)})](${shareLink(data)})
  
Watch [${data.replay.title}](${shareLink(data)}) on Replayable`;
};

const createReplay = function () {
  return new Promise((resolve, reject) => {
    ipc.connectTo("replayable", function () {
      ipc.of.replayable.on("connect", function () {
        // console.log("## connected to replayable ##", ipc.config.delay);
        ipc.of.replayable.emit("create");
      });

      ipc.of.replayable.on("disconnect", function () {
        console.log("disconnected from replayable".notice);
      });

      ipc.of.replayable.on(
        "upload", //any event or message type your server listens for
        function (data) {
          // this is essentially the return value, as this echos to cli
          if (args.format == "link") {
            resolve(shareLink(data));
          } else {
            resolve(markdownPreview(data));
          }
        }
      );
    });
  });
};

if (!module.parent) {
  (async () => {
    let result = await createReplay();
    console.log(result);
    process.exit(0);
  })();
}

module.exports = { createReplay };
