# Contributing

This site is a static GitHub Pages project for publishing poetry, music, and other creative work in a Classic Mac OS style.

Most content can be added without touching the JavaScript. The site loads content from markdown files in subfolders.

---

## Project Structure

```/dev/null/tree.txt#L1-11
TEST/
├── index.html
├── css/style.css
├── js/app.js
├── poems/
│   ├── index.json
│   └── *.md
├── works/
│   ├── index.json
│   └── *.md
└── CONTRIBUTING.md
```

---

## How content loading works

Because this site is hosted statically on GitHub Pages, it cannot automatically list files in a folder on its own.

So each content folder uses:

1. a folder of markdown files
2. an `index.json` manifest listing those files in order

If you add a new poem or work, you must:

- create the markdown file
- add its filename to the relevant `index.json`

---

## Adding a Poem

### 1. Create a new markdown file in `poems/`

Example filename:

```/dev/null/example.txt#L1-1
poems/my-new-poem.md
```

### 2. Use this format

```/dev/null/poem.md#L1-10
---
title: My New Poem
meta: 2025 · Free verse
---

First line of the poem
Second line of the poem

A new stanza starts after a blank line.
```

### Required poem fields

- `title` — displayed in the poem list and reader
- `meta` — usually year + form, for example:
  - `2025 · Free verse`
  - `2024 · Prose poem`
  - `2023 · Sonnet`

### Notes for poems

- The poem body is shown with line breaks preserved.
- Blank lines create stanza breaks.
- You do not need HTML.
- Keep the frontmatter wrapped in `---`.

### 3. Add the filename to `poems/index.json`

Example:

```/dev/null/index.json#L1-5
[
  "existing-poem.md",
  "my-new-poem.md"
]
```

The order in `index.json` is the order shown on the site.

---

## Adding an Other Work

### 1. Create a new markdown file in `works/`

Example filename:

```/dev/null/example.txt#L1-1
works/my-new-work.md
```

### 2. Use this format

```/dev/null/work.md#L1-12
---
icon: ✍️
type: Essay
title: My New Work
year: 2025
desc: A short one-sentence description for the card view.
---

This is the main body of the work.

You can write in paragraphs, and the site will render them cleanly.

- You can also use bullet lists
- Like this

## And simple headings
```

### Required work fields

- `icon` — emoji shown on the card and detail view
- `type` — category, like `Essay`, `Short Story`, `Visual`
- `title` — item title
- `year` — publication/completion year
- `desc` — short summary shown on the grid card

### Notes for Other Works

The body supports basic markdown-style formatting:

- paragraphs
- `#`, `##`, `###` headings
- bullet lists using `-`
- blockquotes using `>`
- inline emphasis like `*italic*` and `**bold**`
- inline code using backticks
- links like `[title](https://example.com)`

### 3. Add the filename to `works/index.json`

Example:

```/dev/null/index.json#L1-5
[
  "existing-work.md",
  "my-new-work.md"
]
```

Again, the file order controls the display order on the site.

---

## Editing existing content

To edit a poem or work:

1. open the corresponding markdown file
2. change the frontmatter and/or body
3. commit and push

No additional build step is required.

---

## Music section

The music section is still managed directly in `index.html`.

Look for the audio player blocks and update the `src=""` values to point at your audio files.

Example:

```/dev/null/audio-example.html#L1-3
<audio controls src="audio/my-track.mp3" preload="none">
  Your browser does not support the audio element.
</audio>
```

You can create an `audio/` folder in the project root and place your `.mp3` files there.

---

## Frontmatter rules

Keep frontmatter simple:

- one field per line
- use `key: value`
- do not nest objects
- do not use tabs
- keep the opening and closing `---`

Good:

```/dev/null/good-frontmatter.md#L1-5
---
title: Example
year: 2025
---
```

Avoid:

```/dev/null/bad-frontmatter.md#L1-6
---
title:
  text: Example
year: [2025]
---
```

---

## File naming suggestions

Use lowercase filenames with hyphens:

```/dev/null/filenames.txt#L1-5
the-weight-of-small-things.md
rain-on-aluminum.md
night-shift-at-the-observatory.md
what-maps-leave-out.md
```

This keeps paths clean and predictable.

---

## Local preview

If you open the site directly from the filesystem, some dynamic markdown loading may fall back to inline content depending on your browser.

For the most accurate preview, use a simple local web server or preview through GitHub Pages.

---

## Submitting changes

After editing content:

```/dev/null/git-steps.txt#L1-4
git add .
git commit -m "Add new poem and essay"
git push origin main
```

GitHub Pages will publish the changes automatically after the push completes.

---

## Content style tips

### For poems
- Keep titles short and clear
- Use blank lines for stanza separation
- Put year and form in `meta`

### For Other Works
- Keep `desc` short
- Use the body for the full piece or excerpt
- Use an emoji that helps distinguish the kind of work

Suggested icons:
- `📖` — short story
- `✍️` — essay
- `🖼️` — visual work
- `🎞️` — video
- `🎭` — performance
- `🧪` — experimental piece

---

## If something does not appear

Check these first:

1. Is the new filename listed in the correct `index.json`?
2. Is the filename spelled exactly the same?
3. Is the frontmatter wrapped in `---`?
4. Did you push to `main`?
5. Did GitHub Pages finish deploying?

---

## Summary

- Add poems in `poems/*.md`
- Add works in `works/*.md`
- Update `poems/index.json` or `works/index.json`
- Push to GitHub
- GitHub Pages publishes the update

That’s it.