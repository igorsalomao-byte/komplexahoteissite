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
├── contato.html          # Contato (all CTAs → komplexa-pricing.vercel.app/f/komplexaconsultoria)
├── blog/
│   ├── index.html        # Blog listing
│   ├── _template.html    # Post template (FAQ + schema) — base for new posts
│   └── post-ota.html     # Example published post
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

**All CTAs link to:** `https://komplexa-pricing.vercel.app/f/komplexaconsultoria?utm_source=komplexahoteis&utm_medium=site&utm_content={page}` (target="_blank")

`utm_content` varies per page: `home`, `sistema`, `ia`, `arquitetura`, `contato`, `blog-listing`, `blog-{slug}` for each post, `deck-{name}` for each `d/` deck.

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

Copy `blog/_template.html` as the base (it already includes the full SEO `<head>`, the FAQ section + `FAQPage` schema, and the `.data-block`/`.faq` styles). Replace the `__PLACEHOLDER__` tokens and update:
- `<title>`, `<meta name="description">`, `<meta name="keywords">`
- Canonical, Open Graph and Twitter URLs (use the post slug)
- `BlogPosting` + `BreadcrumbList` + `FAQPage` JSON-LD in the `<head>` (dates, slug, category, keywords)
- `.post-breadcrumb` category label and `.post-category-pill` text
- `<h1>` headline and `.post-meta` date + reading time
- Article body inside `<article class="post-content">`
- **FAQ:** keep the visible `<details class="faq-item">` questions **identical** to the `FAQPage` schema in the `<head>`
- Table of contents links in `.sidebar-card` (href="#id")
- Related posts in sidebar and `.related-grid`

Then update `blog/index.html` to add the new post card in `.posts-grid`, and add the post URL to `sitemap.xml`.

## Content Source

All copy is based on `komplexa_hoteis_resumo.md` in the project root. Refer to it when writing new sections or blog posts to stay consistent with tone and positioning.
