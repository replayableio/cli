<img src="https://github.com/replayableio/cli/assets/318295/c8019bca-e4d8-42a2-af55-0f4c83ce133e" height="60px" />

# Dashcam CLI

Add Dashcam to your app or workflow. This package allows you to capture logs and control the Dashcam desktop application via CLI.

Requires that you [install Dashcam Desktop](https://dashcam.io).

# Manual

```
Usage: dashcam [options] [command]

Capture the steps to reproduce every bug.

Options:
  -V, --version         output the version number
  -h, --help            display help for command

Commands:
  auth <api-key>    Authenticate the dashcam desktop using a team's apiKey
  create [options]  Create a clip and output the resulting url or markdown. Will launch desktop app for local editing before publishing.
  record [options]  Start a recording terminal to be included in your dashcam video recording
  pipe              Pipe command output to dashcam to be included in recorded video
  track [options]  Add a logs config to Dashcam
  start             Start instant replay recording on dashcam
  help [command]    display help for command
```

## Table of contents

- [Dashcam CLI](#dashcam-cli)
- [Manual](#manual)
  - [Table of contents](#table-of-contents)
- [Examples](#examples)
  - [CLI](#cli)
    - [Setup](#setup)
    - [Auth](#auth)
    - [Record CLI](#record-cli)
    - [Pipe command output into dashcam for recording](#pipe-command-output-into-dashcam-for-recording)
    - [Create a Replay](#create-a-replay)
    - [Return a rich markdown link](#return-a-rich-markdown-link)
    - [Set a replay title](#set-a-replay-title)
    - [Set a project to publish to](#set-a-project-to-publish-to)
    - [Attach the last 20 CLI commands to the replay](#attach-the-last-20-cli-commands-to-the-replay)
    - [Attach a logfile to the replay](#attach-a-logfile-to-the-replay)
  - [GitHub CLI](#github-cli)
    - [Create a github issue with a replay in the description](#create-a-github-issue-with-a-replay-in-the-description)
    - [Create a github pull request with a replay in the description](#create-a-github-pull-request-with-a-replay-in-the-description)
    - [Append a 30 second replay to a commit](#append-a-30-second-replay-to-a-commit)
- [Advanced Usage](#advanced-usage)
  - [Web](#web)
    - [Setup](#setup-1)
    - [HTML Anchor Tag](#html-anchor-tag)
    - [JS Error Handler](#js-error-handler)
  - [NodeJS SDK](#nodejs-sdk)
    - [Setup](#setup-2)
    - [Create a Replay](#create-a-replay-1)
    - [Error Handler](#error-handler)
  - [Ideas](#ideas)

# Examples

Also see [the examples folder](https://github.com/replayableio/cli/tree/main/examples).

## CLI

### Setup

```sh
npm install dashcam -g
```

### Auth

To authenticate the Dashcam desktop app using a team's Api key, Use the following command

```
dashcam auth <Api-Key>
```

### Record CLI

To record the CLI in the Dashcam app, use the following command

```
dashcam record
```

Anything you type in your terminal will appear in your dash. To exit, simply type `exit`.

```
exit
```

## Add a new logs config to dashcam

Add a new logs config to dashcam by specifying a name, a type ("application" or "web"), and one or multiple patterns for the urls in the case of a web logs config, or for file paths in the case of an application logs config.

```
dashcam track --name=social --type=web --pattern="*facebook.com*" --pattern="*twitter.com*"
```

## Pipe command output into dashcam for recording

To record the output of a command in the Dashcam app (In this example the `ping 1.1.1.1` command ), use the following command

```
ping 1.1.1.1 | dashcam pipe
```

## Create a Replay

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

### Set a project to publish to

```sh
$ dashcam -k wef8we72h23012j
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
