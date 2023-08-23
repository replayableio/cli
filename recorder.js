const fs = require("fs");
const pty = require("node-pty-prebuilt-multiarch");

class Recorder {
  #ptyProcess = null;
  #logFile = null;

  constructor(logFile) {
    // This way we don't run the recording script recursively, especially
    // if it's inside bash/zsh configs
    if (process.env.DASHCAM_TERMINAL_RECORDING) {
      console.log("The current terminal is already being recorded");
      process.exit(0);
    }
    this.#logFile = logFile;
  }

  #onInput(data) {
    this.#ptyProcess.write(data);
  }

  #onData(data) {
    process.stdout.write(data);
    fs.appendFileSync(this.#logFile, data, "ascii");
  }

  start() {
    console.log(
      "This session is being recorded by Dashcam and dumped to",
      this.#logFile
    );
    console.log("Type `exit` to stop recording");

    // TODO: Find a way to consistently get the current shell this is running from
    // instead of using the default user shell (Maybe use parent processId to find
    // the process filepath)
    const shell = process.env.SHELL;
    const args = [];
    if (!shell.toLowerCase().includes("powershell")) args.push("-l");
    this.#ptyProcess = pty.spawn(shell, args, {
      // Inject a terminal variable to let the child processes know
      // of the active recording so they we don't record recursively
      env: { ...process.env, DASHCAM_TERMINAL_RECORDING: "TRUE" },
    });

    process.stdin.on("data", this.#onInput.bind(this));
    this.#ptyProcess.on("data", this.#onData.bind(this));
    this.#ptyProcess.on("exit", this.stop.bind(this));

    process.stdout.setDefaultEncoding("utf8");
    process.stdin.setEncoding("utf8");
    process.stdin.setRawMode(true);
    process.stdin.resume();
  }

  stop() {
    process.stdin.removeListener("data", this.#onInput.bind(this));
    process.stdin.setRawMode(false);
    process.stdin.pause();
    console.clear();
    process.kill(process.ppid, "SIGTERM");
    process.exit();
  }
}

module.exports = Recorder;
