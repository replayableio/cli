# Replayable CLI

This is intended to an npm module installed globally. It allows you to publish a replay and get the future location via CLI.

This allows you to do cool things like append a 30 second replay to a commit:

```sh
gh issue create -b "$(printf "I encountered an issue: \n\n$replayable"; replayable --public --format=md --image=gif)"
```

## Demo
<a href="https://www.loom.com/share/ea9c2831013a4b5eb996bd47f8178f4e">
  <p>Capture bugs with replayable. - Watch Video</p>
  <img style="max-width:300px;" src="https://cdn.loom.com/sessions/thumbnails/ea9c2831013a4b5eb996bd47f8178f4e-with-play.gif">
</a>

# Usage

```sh
npm install replayable -g
replayable
```

## Options

```
--public (boolean) - triggers share
--format=(link|md) - returns a link or markdown
--image=(gif|png) - determines screenshot format (only if --format=md)
```

## Possibilities

It would be possible to string this along in [a git hook](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks) to publish with every commit.
