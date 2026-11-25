# Taranpreet Kaur — Digital Marketing Portfolio

Redesigned, interactive single-page portfolio for **Taranpreet Kaur** (Digital Marketing Specialist — SEO, PPC, AEO, GEO, analytics).

**Live:** https://taran-preet-kaur.github.io/

Built with plain HTML / CSS / vanilla JavaScript — no frameworks, fully deployable to GitHub Pages.

## Run locally

Just open `index.html` in a browser, or serve the folder:

```bash
npx serve .
# or
python -m http.server 8080
```

## Features

- **Interactive case studies** — tabbed switcher with animated panels
- **Animated counters** — scroll-triggered stats
- **Typing rotator** — animated role highlights in the hero
- **Scroll reveal** animations, scroll progress bar, back-to-top
- **Scrollspy** nav with active section highlighting + mobile menu
- **Light / dark theme** toggle (persisted, respects system preference)
- **Contact form** that composes a `mailto:` link
- Fully responsive + print-friendly + `prefers-reduced-motion` support

## Deploy to GitHub Pages

The folder is ready to be served as a GitHub Pages site.

### Option 1 — New repository (recommended)

```bash
cd tannu-portfolio
git init
git add .
git commit -m "Initial Taranpreet Kaur portfolio"
git branch -M main
gh repo create taranpreet821/taranpreet-kaur --public --clone=false
git push -u origin main
gh api repos/taranpreet821/taranpreet-kaur/pages -method POST -field "source[branch]=main" -field "source[path]=/"
```

### Option 2 — Inside an existing GitHub repository

Copy the contents of `tannu-portfolio/` into the repo root or the `/docs` folder of your GitHub repository, then set **Settings → Pages → Source → Deploy from a branch → `main` → `/ (root)`** (or `/docs`).

## Before going live

- Email set: `taranpreet8219@gmail.com`
- LinkedIn set: `https://www.linkedin.com/in/tannu82/`
- Confirm client permissions and anonymise figures before publishing case studies.
