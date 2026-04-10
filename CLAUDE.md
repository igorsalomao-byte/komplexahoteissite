# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Website institucional da **Komplexa Hotéis** — agência de arquitetura de crescimento para reservas diretas em hotelaria.

## Tech Stack

Pure HTML + CSS + vanilla JS. No build system, no framework, no dependencies (only Google Fonts via CDN). Open `index.html` directly in the browser.

## File Structure

```
/
├── index.html            # Home
├── sistema.html          # O Sistema (5 etapas do funil)
├── ia.html               # IA Aplicada
├── arquitetura.html      # Arquitetura de Crescimento Hoteleiro
├── contato.html          # Contato (all CTAs → form.respondi.app)
├── blog/
│   ├── index.html        # Blog listing
│   └── post-ota.html     # Post template (use as base for new posts)
└── assets/
    ├── style.css         # Shared stylesheet (nav, footer, buttons, layout)
    └── logo.svg          # Brand logo (gradient SVG)
```

## Brand

- **Colors:** `#00C6FF` (blue), `#14233C` (navy), `#A8A8A8` (gray), `#FFFFFF` (white), `#F7F9FC` (bg)
- **Gradient:** `linear-gradient(135deg, #1670C3 0%, #1099E9 48%, #24D5FF 100%)`
- **Fonts:** Exo 2 (headings, bold/semibold), Work Sans (body)
- **CSS variables:** `--blue`, `--navy`, `--gray`, `--white`, `--bg`, `--border`, `--grad`

## Key Conventions

**All CTAs link to:** `https://form.respondi.app/QnLOVD5g` (target="_blank")

**Asset paths:**
- Root pages: `assets/style.css`, `assets/logo.svg`
- Blog pages: `../assets/style.css`, `../assets/logo.svg`

**Shared components** (defined in `assets/style.css`, used on every page):
- `nav` + `.nav-inner` + `.mobile-nav` — fixed top nav with hamburger for mobile
- `footer` + `.footer-inner` + `.footer-top` + `.footer-bottom`
- `.btn`, `.btn-primary`, `.btn-outline`, `.btn-ghost` — button variants
- `.cta-banner` — dark navy CTA section used at bottom of every page
- `.tag`, `.section-title`, `.section-sub`, `.grad-text` — typography utilities
- `.card`, `.card-dark` — base card styles

**Page-specific styles** go in a `<style>` block in each HTML file's `<head>`.

**Mobile nav** requires this JS snippet on every page:
```js
function toggleMenu() {
  document.getElementById('mobileNav').classList.toggle('open');
}
```

## Adding a New Blog Post

Copy `blog/post-ota.html` as the template. Key elements to update:
- `<title>` tag
- `.post-breadcrumb` category label
- `.post-category-pill` text
- `<h1>` headline
- `.post-meta` date and reading time
- Article body inside `<article class="post-content">`
- Table of contents links in `.sidebar-card` (href="#id")
- Related posts in sidebar and `.related-grid`

Update `blog/index.html` to add the new post card in `.posts-grid`.

## Content Source

All copy is based on `komplexa_hoteis_resumo.md` in the project root. Refer to it when writing new sections or blog posts to stay consistent with tone and positioning.
