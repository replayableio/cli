#!/usr/bin/env node

const fs = require("fs");
const crypto = require("crypto");
const lib = require("./lib");
const Recorder = require("./recorder");
const packageMetadata = require("./package.json");

if (module.parent) {
  module.exports = lib;
  return;
}

const { program } = require("commander");

program
  .name("dashcam")
  .description("Capture the steps to reproduce every bug.")
  .version(packageMetadata.version);

program.showHelpAfterError();

program
  .command("auth")
  .argument("<api-key>", "The team's ApiKey")
  .description("Authenticate the dashcam desktop using a team's apiKey")
  .action(async function (apiKey) {
    await lib
      .sendApiKey(apiKey)
      .then(() => process.exit())
      .catch(() => process.exit(1));
  });

program
  .command("create", { isDefault: true })
  .description(
    "Create a clip and output the resulting url or markdown. Will launch desktop app for local editing before publishing."
  )
  .option(
    "-t, --title <string>",
    "Title of the clip. Automatically generated if not supplied."
  )
  .option(
    "-d, --description [text]",
    "Markdown body."
  )
  .option("--md", "Returns code for a rich markdown image link.")
  .option("-r --replay", "Create a replay not capture.")
  .option(
    "-p, --publish",
    "Whether to publish the clip instantly after creation or not."
  )
  .option(
    "-k, --project [string]",
    "The project id to which to publish the replay"
  )
  .action(async function (str, options) {
    try {
      let description = this.opts().description;

      let result = await lib.createClip({
        title: this.opts().title,
        description,
        md: this.opts().md,
        publish: this.opts().publish,
        capture: !this.opts().replay,
        png: this.opts().png,
        project: this.opts().project,
      });
      console.log(result);
    } catch (e) {
      console.log("Error: ", e);
    }
    process.exit(0);
  });

program
  .command("record")
  .option("-s, --silent", "Use silent mode when recording")
  .description(
    "Start a recording terminal to be included in your dashcam video recording"
  )
  .action(async function ({ silent }) {
    try {
      const dashcam = new lib.PersistantDashcamIPC();
      const id = crypto.randomUUID();
      const logFile = lib.getLogFilePath(id);

      dashcam.onConnected = () => dashcam.emit("track-cli", logFile);
      fs.appendFileSync(logFile, "");
      const recorder = new Recorder(logFile, silent);
      await recorder.start();
    } catch (e) {
      console.log("Error: ", e);
    }
  });

program
  .command("pipe")
  .description(
    "Pipe command output to dashcam to be included in recorded video"
  )
  .action(async function () {
    try {
      const dashcam = new lib.PersistantDashcamIPC();
      const id = crypto.randomUUID();
      const logFile = lib.getLogFilePath(id);

      dashcam.onConnected = () => dashcam.emit("track-cli", logFile);
      fs.appendFileSync(logFile, "");
      process.stdin.on("data", (data) => {
        process.stdout.write(data);
        fs.appendFileSync(logFile, data);
      });
      process.stdin.on("close", () => process.exit());
      process.stdin.on("error", () => process.exit(1));
    } catch (e) {
      console.log("Error: ", e);
    }
  });

program
  .command("track")
  .requiredOption("--name <name>", "The name for the log config.")
  .requiredOption(
    "--type <type>",
    'The type of log config ("web" or "application").'
  )
  .requiredOption(
    "--pattern <patterns...>",
    'The patterns of the urls in the case of "web" or the file paths in the case of "application" (Can contain wildcards \'*\'), multiple patterns can be provided.'
  )
  .description("Add a logs config to Dashcam")
  .action(async function ({ name, type, pattern: patterns }) {
    if (!["web", "application"].includes(type)) {
      console.log('The "type" options needs to be "web" or "application"');
    } else {
      await lib.addLogsConfig({ name, type, patterns });
    }
    process.exit(0);
  });

program
  .command("start")
  .description("Start capture on dashcam")
  .option("-r, --replay", "Start replay, not capture.")
  .action(async function (name, options) {
    try {
      const isCapture = !this.opts().replay;
      await lib.startRecording(isCapture);
      process.exit(0);
    } catch (e) {
      console.log("startRecording error: ", e);
      process.exit(1);
    }
  });

program.parse(process.argv);
