const { readFileSync, writeFileSync } = require("fs");
const { execSync } = require("child_process");
const COMMIT_EDITMSG = process.argv[2];

const stdout = execSync("replayable");
const message = readFileSync(COMMIT_EDITMSG, "utf-8");
writeFileSync(
  COMMIT_EDITMSG,
  `${stdout.replace(/(-|_).*/, "")} ${message}`.replace(/\n/, "")
);
