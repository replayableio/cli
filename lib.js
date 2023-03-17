const ipc = require("node-ipc").default;
const clc = require("cli-color");

ipc.config.id = "dashcam-cli";
ipc.config.retry = 1500;
ipc.config.silent = true;
ipc.config.maxRetries = 0;

const connectToIpc = function () {
  return new Promise((resolve, reject) => {
    ipc.connectTo("dashcam");
    ipc.of.dashcam.on("connect", resolve);
    ipc.of.dashcam.on("error", (e) => {
      if (e.code === "ENOENT") {
        console.log(
          clc.red("Could not connect to Dashcam Desktop App. Is it running?")
        );
        console.log(
          clc.yellow(
            "You may need to download and install the app from https://bit.ly/3ipoQLJ"
          )
        );
      }
    });
    ipc.of.dashcam.on("disconnect", function () {
      console.log("Disconnected from Dashcam");
    });
  });
};

const createReplay = async function (options = {}) {
  options.md = options.md || false;

  options.title = options.title || false;
  options.description = options.description || null;

  await connectToIpc();

  return new Promise(async (resolve, reject) => {
    ipc.of.dashcam.on(
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
      reject(
        "Dashcam Desktop App did not respond in time. Did you publish a clip?"
      );
    }, 60000 * 5);

    ipc.of.dashcam.emit("create", {
      title: options.title,
      description: options.description,
    });
  });
};

module.exports = { createReplay };
