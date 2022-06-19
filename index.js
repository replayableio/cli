#!/usr/bin/env node
const args = require("yargs").argv;
const ipc = require("node-ipc").default;
const { execSync } = require("child_process");

ipc.config.id = "hello";
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

const getGitMetaData = function() {
  try {
    return {
      COMMIT_HASH: execSync("git rev-parse HEAD").toString().trim().slice(0, 6),
      BRANCH_NAME: execSync("git rev-parse --abbrev-ref HEAD").toString().trim(),
      ORIGIN_URI: execSync("git config --get remote.origin.url").toString().trim(),
      STASH_LIST: execSync("git stash list").toString().trim(),
      LOG: execSync("git log").toString().trim(),
    }
  } catch (error) {
    return {};
  }
};

ipc.connectTo("replayable", function () {
  console.log(ipc.of.replayable, 'replayable');
  ipc.of.replayable.on("connect", function () {
    ipc.of.replayable.emit("create", { git: getGitMetaData() });
  });

  ipc.of.replayable.on("disconnect", function () {
    console.log("disconnected from replayable".notice);
  });

  ipc.of.replayable.on(
    "upload", //any event or message type your server listens for
    function (data) {
      // this is essentially the return value, as this echos to cli
      if (args.format == "link") {
        console.log(shareLink(data));
      } else {
        console.log(markdownPreview(data));
      }

      process.exit(0);
    }
  );
});
