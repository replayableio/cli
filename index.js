#!/usr/bin/node
const ipc = require("node-ipc").default;

ipc.config.id = "hello";
ipc.config.retry = 1500;
ipc.config.silent = true;

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
      console.log(data);
      process.exit(0);
    }
  );
});
