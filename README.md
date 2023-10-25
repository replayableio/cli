<img src="https://github.com/replayableio/cli/assets/318295/c8019bca-e4d8-42a2-af55-0f4c83ce133e" height="60px" />

# Dashcam CLI

Add Dashcam to your app or workflow. This package allows you to capture logs and control the Dashcam desktop application via CLI.

Requires that you [install Dashcam Desktop](https://dashcam.io).

## Table of contents

- [CLI](#cli)
  - [Setup](#setup)
  - [Record CLI](#record-cli)
  - [Create a Dash](#create-a-replay)
  - [Return a rich markdown link](#return-a-rich-markdown-link)
  - [Set a Dash title](#set-a-replay-title)
  - [Attach the last 20 CLI commands to the Dash](#attach-the-last-20-cli-commands-to-the-replay)
  - [Attach a logfile to the replay](#attach-a-logfile-to-the-replay)
- [Web SDK](#web)
  - [Setup](#setup)
  - [HTML Anchor Tag](#html-anchor-tag)
  - [JS Error Handler](#js-error-handler)
- [NodeJS SDK](#nodejs-sdk)
  - [Setup](#setup)
  - [Create a Dash](#create-a-replay)
  - [Error Handler](#error-handler)
- [GitHub CLI](#github-cli)
  - [Create a GitHub issue with a Dash in the description](#create-a-github-issue-with-a-replay-in-the-description)
  - [Create a GitHub pull request with a Dash in the description](#create-a-github-pull-request-with-a-replay-in-the-description)
  - [Append a 30 second Dash to a commit](#append-a-30-second-replay-to-a-commit)

# Examples

Also see [the examples folder](https://github.com/replayableio/cli/tree/main/examples).

## CLI

### Setup

```sh
npm install dashcam -g
```

## Record CLI

To record the CLI in the Dashcam app, use the following command

```
dashcam record
```

Anything you type in your terminal will appear in your dash. To exit, simply type `exit`.

```
exit
```

## Pipe command output into dashcam for recording

To record the output of a command in the Dashcam app (In this example the `ping 1.1.1.1` command ), use the following command

```
ping 1.1.1.1 | dashcam pipe
```

### Create a Replay

```sh
$ dashcam
https://dashcam.io/replay/123?share=xyz
```

### Return a rich markdown link

```sh
$ dashcam --md

[![Dashcam - New Replay](https://replayable-api-production.herokuapp.com/replay/123/gif?shareKey=xyz)](https://replayable.io/replay/123?share=xyz)

Watch [Dashcam - New Replay](https://dashcam.io/replay/123?share=xyz) on Dashcam
```

### Set a replay title

```sh
$ dashcam -t "My New Title"
```

### Attach the last 20 CLI commands to the replay

```sh
$ history -20 | dashcam
```

### Attach a logfile to the replay

This will attach the mac system log to the replay.

```sh
$ cat /var/log/system.log | dashcam
```

## GitHub CLI

The following examples depend on having the [GitHub CLI](https://cli.github.com/) installed.

### Create a github issue with a replay in the description

```sh
$ gh issue create -w -t "Title" -b "`dashcam --md`"
```

This is where it gets really cool. For example, this single command will create a GitHub issue with a video replay and the mac system logs.

```
gh issue create -w -t "Title" -b "`cat /var/log/system.log | dashcam --md`"
```

### Create a github pull request with a replay in the description

```sh
$ gh pr create -w -t "Title" -b "`dashcam --md`"
```

### Append a 30 second replay to a commit

```sh
$ git commit -am "`dashcam`"
```

# Advanced Usage

```
Usage: dashcam create [options]

Create a replay and output the resulting url or markdown. Will launch desktop app for local editing before publishing.

Options:
  -t, --title <string>      Title of the replay. Automatically generated if not supplied.
  -d, --description [text]  Replay markdown body. This may also be piped in: `cat README.md | dashcam create`
  --md                      Returns code for a rich markdown image link.
  -h, --help                display help for command
```

## Web

### Setup

Nothing! The app exposes the protocol to the system natively via `dashcam://`.

### HTML Anchor Tag

```html
<a href="dashcam://replay/create" target="_blank">Create a Replay</a>
```

### JS Error Handler

```js
window.onerror = function myErrorHandler() {
  window.open("dashcam://replay/create", "_blank");
};

setTimeout(() => {
  throw new Error("Throw makes it go boom!");
}, 3000);
```

## NodeJS SDK

### Setup

```sh
npm install dashcam
```

### Create a Replay

```js
const dashcam = require("dashcam");

let replay = await dashcam.createReplay({
  title: "My New Replay",
  description: `This **renders markdown** or plaintext in monospace font.`,
});
```

### Error Handler

```js
const dashcam = require("dashcam");

process.on("uncaughtException", async (err) => {
  let replay = await dashcam.createReplay({
    title: "uncaughtException",
    description: err,
  });
  console.log("Dashcam", replay);
});

setTimeout(() => {
  throw new Error("Throw makes it go boom!");
}, 3000);
```

## Ideas

It would be possible to string this along in [a git hook](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks) to publish with every commit.
