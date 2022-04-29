# Replayable CLI

# Add instant-replay into your developer workflow.

First, [install Replayable Desktop](https://replayable.zendesk.com/hc/en-us/articles/4421207018011-Download-Replayable-Desktop). Replayable Desktop records a local 1 hour buffer that you can publish to replayable.io.

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

## Git Hook

It would be possible to string this along in [a git hook](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks) to publish with every commit.

asf
