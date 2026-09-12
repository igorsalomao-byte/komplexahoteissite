# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Website institucional da **Komplexa Hotéis** — agência de aquisição para hotelaria (marketing e vendas
integrados para hotéis, pousadas e resorts crescerem o canal direto). Publicado pelo GitHub Pages a partir
do `main` em `komplexahoteis.com` (CNAME na raiz).

## ⚠️ Estado do trabalho (set/2026)

O site inteiro foi migrado para o visual novo (Template 6 "Autoral" com a paleta Komplexa) e
**publicado no `main` em 12/set/2026**: home, 13 posts + índice do blog, `sistema`, `ia`, `arquitetura`,
`contato`, `agencia-marketing-hoteleiro` e `404`. A branch `site-novo` já foi mesclada.

Decisão do Igor: **operar só com a home + blog por enquanto.** As páginas `sistema`, `ia`, `arquitetura`
e `contato` ficam no ar (indexadas, no sitemap) mas **sem link** no menu, no rodapé e nos posts, até
serem revisadas. A landing `agencia-marketing-hoteleiro` nunca teve link (só SEO). Afirmações dessas
páginas que ainda precisam de confirmação do Igor: chatbot de atendimento e precificação por IA (`ia`),
Omnibees/HSystem/Erbon como integrações e "não precisa trocar motor/PMS" (`sistema`), "comissão de
15% a 25%" (`arquitetura`), "3 a 6 meses" na FAQ (`contato`).

Regras:
- **Push no `main` publica em produção**: só com pedido explícito do Igor.
- `_extraidos/novo-site-snapshot/` (fora do git) era a proposta original da home; não editar.
- Originais das fotos e vídeos antes da compressão: `_extraidos/novo-site-originais/` (fora do git).
- Vídeo do hero (`assets/video/hero.mp4`) é placeholder do template; será trocado quando houver material.
- Critério de qualidade de copy e layout: `_extraidos/site-hotel-boutique/SKILL.md` (sem clichê,
  prova social só real, hierarquia rótulo/título/parágrafo, ênfase com `<em class="gi">`).

Revisão local: `python -m http.server 8765` na raiz → `http://localhost:8765/`.
Prints sem navegador: Chrome headless (`--headless=new --screenshot`); elementos `.rv` ficam invisíveis
no headless, use um wrapper com iframe injetando `.rv{opacity:1!important;transform:none!important}`.

## Tech Stack

HTML + CSS + JS puro, sem build. Dependências via CDN: Google Fonts (Cormorant + Jost), Lenis e GSAP +
ScrollTrigger (efeitos de scroll, menu overlay, reveals `.rv`).

## File Structure

```
/
├── index.html                  # Home (hero em vídeo, método, cases, site entregue, entregáveis, frentes, quem somos, blog, carta)
├── sistema.html, ia.html, arquitetura.html, contato.html, agencia-marketing-hoteleiro.html, 404.html
├── blog/
│   ├── index.html              # Índice com filtro por tema (JS inline)
│   ├── _template.html          # Base para post novo (tokens __X__, FAQ + schema)
│   └── post-*.html             # 13 posts
├── assets/
│   ├── css/style.css           # Único stylesheet (home + bloco "PÁGINAS INTERNAS + BLOG" no fim)
│   ├── js/main.js              # Lenis, GSAP, menu, concierge, cases, funil, reveals
│   ├── img/*.webp, *.png       # Fotos (WebP ≤1920px, q72) e logos de parceiros
│   ├── video/hero.mp4, kaptura.mp4, *-poster.webp
│   ├── og-home.jpg             # Open Graph padrão
│   └── logo.svg, style.css     # LEGADO do site antigo (só os decks em d/ podem depender); não usar em página nova
├── d/                          # Decks/propostas (não indexados, robots Disallow)
├── _extraidos/tools/shell.py   # Gerador da casca compartilhada (fora do git)
├── _extraidos/tools/migrate_blog.py, build_*.py  # Scripts usados na migração (fora do git)
├── sitemap.xml, robots.txt, CNAME
└── komplexa_hoteis_resumo.md   # Fonte de conteúdo/posicionamento
```

## Casca compartilhada (header, menu overlay, concierge, carta do fundador, rodapé)

Toda página não-home é montada pelo gerador `_extraidos/tools/shell.py`, que recorta esses blocos da
`index.html` e ajusta caminhos (`base` = `''` na raiz, `'../'` em `blog/`) e o `utm_content`:

```python
import sys, os; sys.path.insert(0, '_extraidos/tools'); from shell import Shell
sh = Shell(os.getcwd())
html = sh.head(base, title, description, canonical, extra='<style>…</style>' ) \
     + sh.top(base, utm) + MIOLO + sh.carta_cta(base, utm) + sh.bottom(base, utm)
```

- Página com foto no hero usa `<section class="hero-int">` (logo nasce branca e escurece ao rolar).
- Página sem hero de foto (blog) precisa de `class="logo-fix dark"` no `<a class="logo-fix">`.
- Se a home mudar (menu, rodapé, carta), regerar as páginas rodando os `build_*.py` e `migrate_blog.py`
  (este só na primeira migração; para posts já migrados, ajustar direto no HTML).

## Brand

- Tokens em `:root` de `assets/css/style.css`: `--ink #0E1E35`, `--sage #1099E9` (azul de ação),
  `--terra #24D5FF`, `--dark #081525`, `--bg #F3F6FA`, `--grad` (135°, #1670C3 → #1099E9 → #24D5FF).
- Fontes: Cormorant (display, `.t-display`, itálico `.gi` em gradiente) e Jost (texto, peso 300).
- Utilitários: `.wrap`, `.overline`, `.head-center`/`.head-left`, `.p-muted`, `.btn-sage`, `.btn-glass`,
  `.narrow`, `.prose`, `.grid-2/3`, `.card-soft`, `.stat`, `.split`, `.highlight-box`, `.data-block`,
  `.faq-wrap` + `details.faq-item`, `.rg-grid`/`.rg-card`, `.pcard`, `.news-box`.

## Key Conventions

**All CTAs link to:** `https://komplexa-pricing.vercel.app/f/komplexaconsultoria?utm_source=komplexahoteis&utm_medium=site&utm_content={page}` (target="_blank" rel="noopener").
`utm_content`: `home-boutique-*` na home, `{pagina}-header|menu|final|footer` na casca, `blog-{slug}` nos posts, `blog-listing` no índice, `deck-{name}` nos decks.

**Fotos:** converter para WebP (≤1920px no lado maior, q72 para foto, q80 para tela) antes de subir;
`loading="lazy"` fora do hero; só há ~16 fotos únicas, evitar repetir a mesma na mesma dobra.

**Conteúdo:** só prova real (cases medidos no PMS: Bahia Bonita 19x, Solar Dona Dora 3,4x, Sunsmart 60%+,
Karandá 6,5x, Lagamar 7x+). Integrações reais: Omnibees, HSystem, Asksuite, Erbon, Bitz, Foco.

## Adding a New Blog Post

Copie `blog/_template.html`, substitua os tokens `__TITLE__`, `__DESCRIPTION__`, `__KEYWORDS__`, `__SLUG__`,
`__DATE__`/`__DATE_ISO__`, `__READTIME__`, `__CATEGORY__`, `__RELATED__`, `__FAQ_Q1__`/`__FAQ_A1__`.
Mantenha a FAQ visível **idêntica** ao `FAQPage` do `<head>`. Depois: adicione o card no
`blog/index.html` (`.pcard` com `data-cat` igual à categoria) e a URL no `sitemap.xml`. Acione o agente
`seo-blog-lead` após criar ou alterar conteúdo.
