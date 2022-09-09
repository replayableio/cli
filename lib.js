const ipc = require("node-ipc").default;

ipc.config.id = "replayable-cli";
ipc.config.retry = 1500;
ipc.config.silent = true;
ipc.config.maxRetries = 0;


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

const createReplay = async function (options) {

  options.private = options.private || false;
  options.png = options.png || false;
  options.link = options.link || false;
  options.title = options.title || false;
  options.description = options.description || null;

  await connectToIpc();

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
    if (options.png) {
      return pngUrl(data);
    } else {
      return gifUrl(data);
    }
  };

  const shareLink = function (data) {
    return `${data.WEB_URL}/replay/${data.replay.id}/${shareQuery(data)}`;
  };

  const shareQuery = function (data) {
    return options.private ? "" : `?share=${data.replay.shareKey}`;
  };

  const markdownPreview = function (data) {
    return `[![${data.replay.title}](${imageUrl(data)})](${shareLink(data)})

Watch [${data.replay.title}](${shareLink(data)}) on Replayable`;
  };

  return new Promise(async (resolve, reject) => {

    ipc.of.replayable.on(
      "upload", //any event or message type your server listens for
      function (data) {
        // this is essentially the return value, as this echos to cli
        if (options.link) {
          resolve(shareLink(data));
        } else {
          resolve(markdownPreview(data));
        }
      }
    );

    ipc.of.replayable.emit("create", {
      title: options.title,
      description: options.description
    });

  });

};

module.exports = { createReplay };
