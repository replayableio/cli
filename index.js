#!/usr/bin/env node

const lib = require("./lib");
const { program } = require("commander");

let stdin = "";

program
  .name("replayable")
  .description(
    "Upgrade your bug reports, pulls, and readmes with clips from local development"
  )
  .version("0.0.9");

program.showHelpAfterError();

program
  .command("create", { isDefault: true })
  .description(
    "Create a replay and output the resulting url or markdown. Will launch desktop app for local editing before publishing."
  )
  .option(
    "-t, --title <string>",
    "Title of the replay. Automatically generated if not supplied."
  )
  .option(
    "-d, --description [text]",
    "Replay markdown body. This may also be piped in: `cat README.md | replayable create`"
  )
  .option("--md", "Returns code for a rich markdown image link.")
  .action(async function (str, options) {
    try {
      let description = this.opts().description;
      if (stdin) {
        description = stdin;
      }

      let result = await lib.createReplay({
        title: this.opts().title,
        description,
        private: this.opts().private,
        md: this.opts().md,
        png: this.opts().png,
      });
      console.log(result);
    } catch (e) {
      console.log("Error: ", e);
    }
    process.exit(0);
  });

if (process.stdin.isTTY) {
  program.parse(process.argv);
} else {
  process.stdin.on("error", function () {});
  process.stdin.on("readable", function () {
    var chunk = this.read();

    if (chunk !== null) {
      stdin += chunk;
    }
  });
  process.stdin.on("end", function () {
    program.parse(process.argv);
  });
}

if (module.parent) {
  module.exports = lib;
}
