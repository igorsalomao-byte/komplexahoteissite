#!/usr/bin/env node
/**
 * Cria um novo post de blog para o site Komplexa Hotéis.
 *
 * Uso:
 *   node novo-post.js <slug> "<título>" "<categoria>" "<emoji>" "<data>" "<tempo>" "<descrição>" [<thumb>]
 *
 * Argumentos:
 *   slug        Identificador único do post (ex: ltv, funil, revpar)
 *   título      Título completo do post
 *   categoria   Categoria (ex: "CRM e Pós-venda", "Reservas Diretas")
 *   emoji       Emoji para o thumbnail (ex: ♻️ 📈 🤖)
 *   data        Data por extenso (ex: "Maio 2026")
 *   tempo       Tempo de leitura (ex: "6 min")
 *   descrição   Resumo para o card e meta tags
 *   thumb       Classe visual do thumbnail: t1 a t5 (padrão: t1)
 *
 * Exemplo:
 *   node novo-post.js ltv "LTV em hotéis: o ativo ignorado" "CRM e Pós-venda" "♻️" "Abril 2026" "6 min" "Hóspedes antigos são o lead mais barato de reativar." t5
 */

const fs   = require('fs');
const path = require('path');

const MONTHS = {
  janeiro: '01', fevereiro: '02', março: '03', abril: '04',
  maio: '05', junho: '06', julho: '07', agosto: '08',
  setembro: '09', outubro: '10', novembro: '11', dezembro: '12'
};

const args = process.argv.slice(2);

if (args.length < 7) {
  console.log(require('fs').readFileSync(__filename, 'utf8').match(/\/\*\*([\s\S]*?)\*\//)[0]);
  process.exit(1);
}

const [slug, title, category, emoji, dateStr, readtime, description, thumb = 't1'] = args;

// Converte data para ISO
const parts     = dateStr.toLowerCase().split(' ');
const monthNum  = MONTHS[parts[0]] || '01';
const year      = parts[1] || '2026';
const dateIso   = `${year}-${monthNum}-01`;

const baseDir      = __dirname;
const templatePath = path.join(baseDir, 'blog', '_template.html');
const outputPath   = path.join(baseDir, 'blog', `post-${slug}.html`);
const indexPath    = path.join(baseDir, 'blog', 'index.html');

// Verifica se já existe
if (fs.existsSync(outputPath)) {
  console.error(`Erro: blog/post-${slug}.html já existe. Escolha outro slug.`);
  process.exit(1);
}

// Lê template e substitui tokens
let html = fs.readFileSync(templatePath, 'utf8');
html = html.replaceAll('__SLUG__',        slug);
html = html.replaceAll('__TITLE__',       title);
html = html.replaceAll('__DESCRIPTION__', description);
html = html.replaceAll('__CATEGORY__',    category);
html = html.replaceAll('__DATE__',        dateStr);
html = html.replaceAll('__DATE_ISO__',    dateIso);
html = html.replaceAll('__READTIME__',    readtime);
html = html.replaceAll('__EMOJI__',       emoji);
html = html.replaceAll('__THUMB_CLASS__', thumb);

fs.writeFileSync(outputPath, html, 'utf8');
console.log(`✓ Post criado: blog/post-${slug}.html`);

// Adiciona card no topo da grade em blog/index.html
let index = fs.readFileSync(indexPath, 'utf8');

const card = `
      <a href="post-${slug}.html" style="text-decoration:none;color:inherit">
        <div class="post-card">
          <div class="post-thumb ${thumb}">
            ${emoji}
            <span class="post-category">${category}</span>
          </div>
          <div class="post-body">
            <div class="post-meta">${dateStr} · ${readtime}</div>
            <h3>${title}</h3>
            <p>${description}</p>
            <span class="post-link">Ler artigo →</span>
          </div>
        </div>
      </a>
`;

const marker = '<div class="posts-grid">';
if (!index.includes(marker)) {
  console.error('Erro: marcador posts-grid não encontrado em blog/index.html');
  process.exit(1);
}

index = index.replace(marker, marker + card);
fs.writeFileSync(indexPath, index, 'utf8');
console.log(`✓ Card adicionado em blog/index.html`);

console.log(`
Próximos passos:
  1. Abra blog/post-${slug}.html e escreva o conteúdo do artigo
  2. Execute: ./publicar.sh "${title}"
`);
