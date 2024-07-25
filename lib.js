const os = require("os");
const path = require("path");
const clc = require("cli-color");
const ipc = require("node-ipc").default;

ipc.config.id = "dashcam-cli";
ipc.config.retry = 1500;
ipc.config.silent = true;
ipc.config.maxRetries = 0;

const persistantIPC = new ipc.IPC();
persistantIPC.config.retry = 500;
persistantIPC.config.silent = true;

const connectToIpc = function (timeout) {
  return new Promise((resolve, reject) => {
    let timeoutToClean;
    ipc.connectTo("dashcam");
    ipc.of.dashcam.on("connect", () => {
      // console.log(
      //   clc.green("Connected to Dashcam!")
      // );
      resolve();
      if (timeoutToClean) clearTimeout(timeoutToClean);
    });
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
        reject();
      } else {
        console.log(e);
      }
    });
    ipc.of.dashcam.on("disconnect", function () {
      console.log(clc.red("Disconnected from Dashcam"));
      reject();
    });
    if (timeout && typeof timeout === "number") {
      timeoutToClean = setTimeout(() => {
        console.log(
          clc.red("Could not connect to Dashcam Desktop App. Is it running?")
        );
        console.log(
          clc.yellow(
            "You may need to download and install the app from https://bit.ly/3ipoQLJ"
          )
        );
        reject();
      }, timeout);
    }
  });
};

const createClip = async function (options = {}) {
  options.md = options.md || false;
  options.publish = options.publish || false;

  options.title = options.title || false;
  options.description = options.description || null;

  await connectToIpc();

  return new Promise(async (resolve, reject) => {
    ipc.of.dashcam.on(
      "upload", //any event or message type your server listens for
      function (data) {
        if (options.md) {
          resolve(data.replay.gifMarkdown);
        } else {
          resolve(data.replay.shareLink);
        }
      }
    );

    ipc.of.dashcam.on("error", (e) => {
      console.log(e);
    });

    ipc.of.dashcam.on("replay-failed", (errorMessage) => {
      reject(errorMessage);
    });

    setTimeout(() => {
      reject(
        "Dashcam Desktop App did not respond in time. Did you publish a clip?"
      );
    }, 60000 * 10);

    const replay = {
      title: options.title,
      description: options.description,
      publish: options.publish,
      project: options.project,
      capture: options.capture,
    };

    ipc.of.dashcam.emit("create", replay);

    if (!options.publish) {
      resolve(replay);
    }
  });
};

const startRecording = async function (isCapture = false) {
  return new Promise(async (resolve, reject) => {
    await connectToIpc();
    setTimeout(() => {
      reject(
        "Dashcam Desktop App did not respond in time. Cancel startRecording"
      );
    }, 60000 * 5);

    ipc.of.dashcam.emit("start-instant-replay", isCapture);

    resolve({
      started: true,
    });
  });
};

const sendApiKey = async function (apiKey) {
  return new Promise(async (resolve, reject) => {
    await connectToIpc(5000).catch(reject);
    ipc.of.dashcam.emit("auth", { apiKey });
    ipc.of.dashcam.on("auth-state", ({ success, user }) => {
      if (success) {
        console.log(clc.green(`Connected as: ${user?.sub}!`));
        return resolve();
      }
      console.log(clc.red("Could not authenticate using the ApiKey"));
      reject();
    });
    setTimeout(() => {
      console.log(clc.red("Could not authenticate using the ApiKey"));
      reject();
    }, 10000);
  });
};

let singleInstance = null;
class PersistantDashcamIPC {
  #isConnected = false;
  onConnected = null;

  constructor() {
    if (singleInstance) return singleInstance;
    singleInstance = this;

    persistantIPC.connectTo("dashcam");

    persistantIPC.of.dashcam.on("connect", () => {
      this.#isConnected = true;
      if (this.onConnected && typeof this.onConnected === "function")
        this.onConnected();
    });
    persistantIPC.of.dashcam.on("disconnect", () => {
      // console.log('disconnected')
      this.#isConnected = false;
    });
    persistantIPC.of.dashcam.on("error", (e) => {
      // console.log(e)
      this.#isConnected = false;
    });
  }

  emit(event, payload) {
    if (!this.#isConnected) {
      console.log(`Cannot emit event: ${event}. Disconnected!`);
      return;
    }
    persistantIPC.of.dashcam.emit(event, payload);
  }
}

const getLogFilePath = (id) => {
  return path.join(os.tmpdir(), `dashcam_cli_recording_${id}.log`);
};

const addLogsConfig = async (options) => {
  await connectToIpc();
  ipc.of.dashcam.emit("add-logs-config", options);
};

module.exports = {
  sendApiKey,
  createClip,
  addLogsConfig,
  getLogFilePath,
  startRecording,
  PersistantDashcamIPC,
};
