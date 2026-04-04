# ✦ Creative Works

A personal portfolio website for poetry, music, and other creative works — styled like **Classic Mac OS** (System 7 / Mac OS 9 Platinum appearance) and fully mobile-friendly.

---

## Live Site

> **[your-username.github.io/your-repo-name](https://your-username.github.io/your-repo-name)**  
> *(Update this link after deploying)*

---

## Features

- 🖥️ Classic Mac OS desktop UI — draggable windows, menu bar, desktop icons
- 📄 **Poetry** — list view with individual poem reader
- 🎵 **Music** — HTML5 audio players for original tracks
- 🎨 **Other Works** — grid of short fiction, essays, and visual projects
- 👤 **About** — bio and contact links
- 📱 Mobile-friendly with a bottom dock navigation
- ♿ Accessible — keyboard navigable, ARIA roles, focus indicators
- ⚡ Fully static — no build step, no dependencies, no frameworks

---

## Deploying to GitHub Pages

### Option A — New Repository (Recommended)

1. **Create a new repository** on GitHub (e.g. `creative-works`)
2. **Clone it** to your machine:
   ```
   git clone https://github.com/your-username/creative-works.git
   ```
3. **Copy all files** from this project into the cloned folder
4. **Push to GitHub:**
   ```
   git add .
   git commit -m "Initial deploy"
   git push origin main
   ```
5. Go to your repo → **Settings → Pages**
6. Under **Source**, select `main` branch and `/ (root)` folder
7. Click **Save** — your site will be live in ~60 seconds

### Option B — Existing Repository

1. Push the files to the `main` (or `gh-pages`) branch of your existing repo
2. Enable GitHub Pages under **Settings → Pages** as above

---

## Customizing Your Content

### Update Your Name & Bio

Open `index.html` and find the About window section:

```html
<h2 class="about-name">Your Name</h2>
<p class="about-tagline">Poet · Composer · Writer</p>
```

Update the bio paragraphs in the `.about-bio` div with your own text.

### Update Contact Links

Find the `.about-links` section and update the `href` values:

```html
<a href="mailto:you@example.com" class="mac-btn">✉ Email</a>
<a href="https://github.com/your-username" class="mac-btn" target="_blank">GitHub</a>
```

### Add / Edit Poems

Poems are stored in a JavaScript array in `index.html`. Find the `<script>` block containing `window.POEMS = [...]` and add or edit entries:

```js
{
  title: "Your Poem Title",
  meta: "2024 · Free verse",
  body: `Line one of your poem
Line two of your poem

A new stanza begins here.`
}
```

Each entry needs `title`, `meta` (year and form), and `body` (the poem text, preserving line breaks with template literals).

Also update the list rows in `#poetry-list` to match — add a new `.list-row` div with the next `data-poem` index:

```html
<div class="list-row" data-poem="5" tabindex="0">
  <span class="col-name">Your Poem Title</span>
  <span class="col-meta">2024</span>
</div>
```

And update the status bar count: `<span class="status-left">6 poems</span>`

### Add Music Tracks

Find each `.mac-audio-player` block and update the `src` attribute on the `<audio>` element:

```html
<audio controls src="audio/your-track.mp3" preload="none">
```

Create an `audio/` folder in the project root and place your `.mp3` or `.ogg` files there. Update the track title, meta, and description to match.

### Add Other Works

Find the `.works-grid` section and add or edit `.works-card` entries:

```html
<div class="works-card">
  <div class="works-card-icon">📖</div>
  <div class="works-card-type">Short Story</div>
  <div class="works-card-title">Your Title</div>
  <div class="works-card-year">2024</div>
  <div class="works-card-desc">A short description of the work.</div>
</div>
```

### Change the Site Title

In `index.html`, update the `<title>` tag and Open Graph tags near the top of `<head>`:

```html
<title>Creative Works — Jane Smith</title>
<meta property="og:title" content="Creative Works — Jane Smith" />
```

### Change the Desktop Color

The teal desktop background is set in `css/style.css`. Search for `--mac-desktop` and change the color:

```css
--mac-desktop: #408080; /* Change this to any color you like */
```

Some classic Mac OS desktop colors to try:
- `#408080` — Teal (Mac OS 8 default)
- `#6666CC` — Purple
- `#336633` — Forest green
- `#333366` — Deep navy

---

## Project Structure

```
/
├── index.html          ← Main page (all content lives here)
├── css/
│   └── style.css       ← All styles (Classic Mac OS theme)
├── js/
│   └── app.js          ← Window management, interactions, clock
├── audio/              ← (Create this folder) Place .mp3 files here
└── README.md           ← This file
```

---

## Browser Support

Works in all modern browsers (Chrome, Firefox, Safari, Edge). The Classic Mac OS fonts (Chicago, Geneva) will display if present on the system; otherwise the site gracefully falls back to Arial/sans-serif.

---

## License

Do whatever you want with the code. The sample poems and text are placeholder content — replace them with your own work.

---

*Built with vanilla HTML, CSS, and JavaScript. No frameworks. No build tools. No tracking.*