const replayable = require("./index");

process.on("uncaughtException", async (err) => {
  console.error(err);
  let replay = await replayable.createReplay();
  console.log("Replayable", replay);
});

setTimeout(() => {
  throw new Error("Throw makes it go boom!");
}, 3000);
