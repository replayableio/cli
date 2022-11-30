const ipc = require("node-ipc").default;
const clc = require("cli-color");

ipc.config.id = "replayable-cli";
ipc.config.retry = 1500;
ipc.config.silent = true;
ipc.config.maxRetries = 0;

const connectToIpc = function () {
  return new Promise((resolve, reject) => {
    ipc.connectTo("replayable");
    ipc.of.replayable.on("connect", resolve);
    ipc.of.replayable.on("error", (e) => {
      if (e.code === "ENOENT") {
        console.log(
          clc.red("Could not connect to Replayable Desktop App. Is it running?")
        );
        console.log(
          clc.yellow(
            "You may need to download and install the app from https://bit.ly/3ipoQLJ"
          )
        );
      }
    });
    ipc.of.replayable.on("disconnect", function () {
      console.log("Disconnected from Replayable");
    });
  });
};

const createReplay = async function (options = {}) {
  options.md = options.md || false;

  options.title = options.title || false;
  options.description = options.description || null;

  await connectToIpc();

  return new Promise(async (resolve, reject) => {
    ipc.of.replayable.on(
      "upload", //any event or message type your server listens for
      function (data) {
        if (options.md) {
          resolve(data.replay.markdown);
        } else {
          resolve(data.replay.shareLink);
        }
      }
    );

    setTimeout(() => {
      reject("timeout");
    }, 60000);

    ipc.of.replayable.emit("create", {
      title: options.title,
      description: options.description,
    });
  });
};

module.exports = { createReplay };