# Replayable CLI

This is intended to an npm module installed globally. It allows you to publish a replay and get the future location via CLI.

```sh
npm install replayable -g
replayable
```

This allows you to do cool things like append a 30 second replay to a commit:

```sh
git commit -m "$(printf "My commit message, found here: $replayable-url" ; replayable)"
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

[I am squatting the package name](https://www.npmjs.com/package/replayable) for future publish.

It depends on this pull:
https://github.com/replayableio/desktop/tree/DEV-98_As-a-developer-I-can-create-a-replay-using-the-CLI_Ian-Jennings

[![iTerm2 - ianjennings@macbook-pro-3:~/Development/cli](https://replayable-dev-ian-mac-m1-16.ngrok.io/replay/62141339205b46dbd91f6e21/gif?share=EaqPOFwYj2aRpKR9BTmxJA)](http://localhost:3001/replay/62141339205b46dbd91f6e21/?share=EaqPOFwYj2aRpKR9BTmxJA)

Watch [iTerm2 - ianjennings@macbook-pro-3:~/Development/cli](http://localhost:3001/replay/62141339205b46dbd91f6e21/?share=EaqPOFwYj2aRpKR9BTmxJA) on Replayable
