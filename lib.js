const ipc = require("node-ipc").default;

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
          "Could not connect to Replayable Desktop App. Is it running?"
        );
        console.log(
          "You may need to download and install the app from https://bit.ly/3erITXJ"
        );
      }
    });
    ipc.of.replayable.on("disconnect", function () {
      console.log("Disconnected from replayable".notice);
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
