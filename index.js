#!/usr/bin/env node

const args = require("yargs").argv;
const ipc = require("node-ipc").default;

ipc.config.id = "replayable-cli";
ipc.config.retry = 1500;
ipc.config.silent = true;
ipc.config.maxRetries = 0;
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

const connectToIpc = function () {
  return new Promise((resolve, reject) => {

    ipc.connectTo("replayable");
    ipc.of.replayable.on("connect", resolve)
    ipc.of.replayable.on("error", (e) => {
      if (e.code === 'ENOENT') {
        console.log('Could not connect to Replayable Desktop App. Is it running?')
        console.log('You may need to download and install the app from https://bit.ly/3erITXJ')
      }
    })
    ipc.of.replayable.on("disconnect", function () {
      console.log("disconnected from replayable".notice);
    });
  });
}

const createReplay = function () {
  return new Promise((resolve, reject) => {

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

    ipc.of.replayable.emit("create");

  });

};

if (!module.parent) {
  (async () => {
    await connectToIpc()
    try {
      let result = await createReplay();
      console.log(result);
    } catch (e) {
      console.log('Error: ', e)
    }
    process.exit(0);
  })();
}

module.exports = { createReplay };
