<img src="https://user-images.githubusercontent.com/318295/204898620-922afee0-5415-46a9-a84f-ae6237001bf0.png" height="50" alt="Replayable"/>

# CLI + SDK

Why double-back when you can capture it the first time? Playback and share exactly what happened with Replayable's desktop replay buffer.

This package allows you to control the Replayable desktop application from the CLI or SDK.

You can easily embed desktop replays within git commits, pull requests, bug reports, jira tickets, and even within log files.

Desktop replays are a great way to share context behind problems and document the application state within logs, tickets and more.

<a href="https://www.loom.com/share/ea9c2831013a4b5eb996bd47f8178f4e">
  <p>Capture bugs with replayable. - Watch Video</p>
  <img style="max-width:300px;" src="https://cdn.loom.com/sessions/thumbnails/ea9c2831013a4b5eb996bd47f8178f4e-with-play.gif">
</a>

## Quick Setup

### Install Replayable Desktop

First, [install Replayable Desktop](https://replayable.io/?betacode=CLIENTRY). Replayable Desktop runs in the background giving you access to a buffer of video.

### Install this package

```sh
npm install replayable -g
```

# Table of contents

- [CLI + SDK](#cli--sdk)
  - [Quick Setup](#quick-setup)
- [Examples](#examples)
  - [CLI](#cli)
  - [GitHub CLI](#github-cli)
  - [NodeJS SDK](#nodejs-sdk)
  - [Javascript Integration](#javascript-integration)
- [Advanced Usage](#advanced-usage)

# Examples

Also see [the examples folder](https://github.com/replayableio/cli/tree/main/examples).

## CLI

### Create a Replay

```sh
$ replayable
https://replayable.io/replay/123?share=xyz
```

### Return a rich markdown link

```sh
$ replayable --md

[![Replayable - New Replay](https://replayable-api-production.herokuapp.com/replay/123/gif?shareKey=xyz)](https://replayable.io/replay/123?share=xyz)

Watch [Replayable - New Replay](https://replayable.io/replay/123?share=xyz) on Replayable
```

### Set a replay title

```sh
$ replayable -t "My New Title"
```

### Attach the last 20 CLI commands to the replay

```sh
$ history -20 | replayable
```

### Attach a logfile to the replay

This will attach the mac system log to the replay.

```sh
$ cat /var/log/system.log | replayable
```

## GitHub CLI

The following examples depend on having the [GitHub CLI](https://cli.github.com/) installed.

### Create a github issue with a replay in the description

```sh
$ gh issue create -w -t "Title" -b "`replayable --md`"
```

This is where it gets really cool. For example, this single command will create a GitHub issue with a video replay and the mac system logs.

```
gh issue create -w -t "Title" -b "`cat /var/log/system.log | replayable --md`"
```

### Create a github pull request with a replay in the description

```sh
$ gh pr create -w -t "Title" -b "`replayable --md`"
```

### Append a 30 second replay to a commit

```sh
$ git commit -am "`replayable`"
```

## NodeJS SDK

```js
const replayable = require("replayable");

process.on("uncaughtException", async (err) => {
  let replay = await replayable.createReplay({
    title: "uncaughtException",
    description: err,
  });
  console.log("Replayable", replay);
});

setTimeout(() => {
  throw new Error("Throw makes it go boom!");
}, 3000);
```

## Javascript Integration

Note that this example does not require any library to be installed as the app exposes the protocol natively.

```js
window.onerror = function myErrorHandler() {
  window.open("replayable://replay/create", "_blank");
};

setTimeout(() => {
  throw new Error("Throw makes it go boom!");
}, 3000);
```

# Advanced Usage

```
Usage: replayable create [options]

Create a replay and output the resulting url or markdown. Will launch desktop app for local editing before publishing.

Options:
  -t, --title <string>      Title of the replay. Automatically generated if not supplied.
  -d, --description [text]  Replay markdown body. This may also be piped in: `cat README.md | replayable create`
  --md                      Returns code for a rich markdown image link.
  -h, --help                display help for command
```

## Ideas

It would be possible to string this along in [a git hook](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks) to publish with every commit.
