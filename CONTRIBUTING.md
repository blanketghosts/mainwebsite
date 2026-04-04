# Contributing

This site is a static GitHub Pages project for publishing poetry, music, and other creative work in a Classic Mac OS style.

All user-facing content is loaded from files in the repository. You should not need to edit `js/app.js` to add new poems, works, music tracks, or About content.

---

## Project Structure

```/dev/null/tree.txt#L1-15
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
├── music/
│   └── index.json
├── content/
│   └── about.md
└── CONTRIBUTING.md
```

---

## How content loading works

Because this site is hosted statically on GitHub Pages, it cannot automatically list files in a folder by itself.

So dynamic sections use one of these patterns:

1. a folder of markdown files plus an `index.json` manifest
2. a single JSON file
3. a single markdown file

### Current content sources

- **Poetry** → `poems/*.md` + `poems/index.json`
- **Other Works** → `works/*.md` + `works/index.json`
- **Music** → `music/index.json`
- **About** → `content/about.md`

If you add a new poem or work, you must:

- create the markdown file
- add its filename to the appropriate `index.json`

---

## Adding a Poem

### 1. Create a markdown file in `poems/`

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

### 1. Create a markdown file in `works/`

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

## Editing Music

The music section is driven by `music/index.json`.

Each entry in the array represents one track card and audio player.

### Format

```/dev/null/music-index.json#L1-18
[
  {
    "title": "Threshold",
    "meta": "Acoustic Guitar · 3:42 · 2024",
    "src": "audio/threshold.mp3",
    "desc": "An instrumental piece exploring the space between silence and sound."
  },
  {
    "title": "Correspondence",
    "meta": "Piano · 4:18 · 2024",
    "src": "audio/correspondence.mp3",
    "desc": "A short piano study written during a period of letter-writing."
  }
]
```

### Music fields

- `title` — track title
- `meta` — instrument, duration, year, or other short metadata
- `src` — path to the audio file relative to the site root
- `desc` — short description shown below the player

### Audio file placement

Audio files can live in an `audio/` folder in the project root.

Example:

```/dev/null/audio-paths.txt#L1-3
audio/threshold.mp3
audio/correspondence.mp3
audio/ground-floor.mp3
```

### Notes for music

- Use valid `.mp3`, `.ogg`, or other browser-supported audio formats
- Make sure the `src` path matches the real filename exactly
- The order in `music/index.json` is the order shown on the site

---

## Editing the About Section

The About window is driven by `content/about.md`.

### Format

```/dev/null/about.md#L1-15
---
avatar: ✦
name: Your Name
tagline: Poet · Composer · Writer
email: you@example.com
email_label: Email
github: https://github.com/your-name
github_label: GitHub
twitter: https://twitter.com/your-handle
twitter_label: Twitter/X
---

Welcome. This is a space for poetry, music, and other creative work.

Everything here was made slowly and with care.
```

### About fields

- `avatar` — usually a symbol or emoji
- `name` — displayed as the profile name
- `tagline` — short role line
- `email` — used to build a mail link
- `email_label` — button text for the email link
- `github` — GitHub profile URL
- `github_label` — button text for the GitHub link
- `twitter` — Twitter/X profile URL
- `twitter_label` — button text for the Twitter/X link

### About body

Everything below the frontmatter becomes the About body text.

The body supports basic markdown-style formatting such as:

- paragraphs
- headings
- bullet lists
- links
- emphasis

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

```/dev/null/filenames.txt#L1-6
the-weight-of-small-things.md
rain-on-aluminum.md
night-shift-at-the-observatory.md
what-maps-leave-out.md
my-new-essay.md
```

This keeps paths clean and predictable.

---

## Editing existing content

To edit an existing poem, work, track listing, or About text:

1. open the corresponding file
2. change the frontmatter, JSON, and/or body text
3. commit and push

No build step is required.

---

## Local preview

If you open the site directly from the filesystem, some dynamic content loading may not work depending on your browser.

For the most accurate preview, use a simple local web server or preview through GitHub Pages.

---

## Submitting changes

After editing content:

```/dev/null/git-steps.txt#L1-4
git add .
git commit -m "Add new poem and update music"
git push origin main
```

GitHub Pages will publish the changes automatically after the push completes.

---

## Content tips

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

### For music
- Keep `meta` concise
- Make sure audio files are uploaded before publishing
- Keep filenames simple and lowercase

### For About
- Keep the body concise and personal
- Use labels like `Email`, `GitHub`, and `Twitter/X` for button text
- Prefer stable profile URLs

---

## If something does not appear

Check these first:

1. Is the new filename listed in the correct `index.json`?
2. Is the filename spelled exactly the same?
3. Is the frontmatter wrapped in `---`?
4. Is `music/index.json` valid JSON?
5. Did you push to `main`?
6. Did GitHub Pages finish deploying?

---

## Summary

- Add poems in `poems/*.md`
- Add works in `works/*.md`
- Edit tracks in `music/index.json`
- Edit About in `content/about.md`
- Update `poems/index.json` or `works/index.json` when adding files
- Push to GitHub
- GitHub Pages publishes the update

That’s it.