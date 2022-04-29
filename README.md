# Replayable CLI

This is intended to an npm module installed globally. It allows you to publish a replay and get the future location via CLI.

```sh
npm install replayable -g
```

# Create a github issue with a 30 second instant replay

```sh
gh issue create -w -t "Title" -b "`replayable`"
```

# Append a 30 second replay to a commit

```sh
git commit -m `replayable`
```

## Loom

<a href="https://www.loom.com/share/1d033f698d844d958255a907b31be47b">
  <img style="max-width:300px;" src="https://cdn.loom.com/sessions/thumbnails/1d033f698d844d958255a907b31be47b-with-play.gif">
</a>

## Possibilities

It would be possible to string this along in [a git hook](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks) to publish with every commit.

It is possible to select a previous replay from the buffer and use that instead of the last 30 seconds (though currently there is no way to disable the current 30 seconds from popping up.)

## Future Plans

In the future I plan to support multiple arguments:

```
replayable --force --last 30
```

## Notes

[![iTerm2 - ianjennings@macbook-pro-3:~/Development/cli](https://replayable-dev-ian-mac-m1-16.ngrok.io/replay/621421b40040b150db91be3e/screenshot?shareKey=QsxUawwTD79Sh4lNdWawA)](http://localhost:3001/replay/621421b40040b150db91be3e/?share=QsxUawwTD79Sh4lNdWawA)
Watch [iTerm2 - ianjennings@macbook-pro-3:~/Development/cli](http://localhost:3001/replay/621421b40040b150db91be3e/?share=QsxUawwTD79Sh4lNdWawA) on Replayable
