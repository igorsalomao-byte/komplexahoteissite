#!/usr/bin/env python3
"""
Cria um novo post de blog para o site Komplexa Hotéis.

Uso:
  python novo-post.py <slug> "<título>" "<categoria>" "<emoji>" "<data>" "<tempo>" "<descrição>" [<thumb>]

Argumentos:
  slug        Identificador único do post (ex: ltv, funil, revpar)
  título      Título completo do post
  categoria   Categoria (ex: "CRM e Pós-venda", "Reservas Diretas")
  emoji       Emoji para o thumbnail (ex: ♻️ 📈 🤖)
  data        Data por extenso (ex: "Maio 2025")
  tempo       Tempo de leitura (ex: "6 min")
  descrição   Resumo para o card e meta tags
  thumb       Classe visual do thumbnail: t1 a t5 (padrão: t1)

Exemplo:
  python novo-post.py ltv "LTV em hotéis: o ativo que a maioria ignora" "CRM e Pós-venda" "♻️" "Maio 2026" "6 min" "Hóspedes antigos são o lead mais barato de reativar." t5
"""

import sys
import os

MONTHS = {
    "janeiro": "01", "fevereiro": "02", "março": "03", "abril": "04",
    "maio": "05", "junho": "06", "julho": "07", "agosto": "08",
    "setembro": "09", "outubro": "10", "novembro": "11", "dezembro": "12"
}

def main():
    if len(sys.argv) < 8:
        print(__doc__)
        sys.exit(1)

    slug        = sys.argv[1]
    title       = sys.argv[2]
    category    = sys.argv[3]
    emoji       = sys.argv[4]
    date_str    = sys.argv[5]   # "Maio 2025"
    readtime    = sys.argv[6]   # "6 min"
    description = sys.argv[7]
    thumb       = sys.argv[8] if len(sys.argv) > 8 else "t1"

    # Converte data para ISO
    parts = date_str.lower().split()
    month_num = MONTHS.get(parts[0], "01")
    year = parts[1] if len(parts) > 1 else "2026"
    date_iso = f"{year}-{month_num}-01"

    base_dir     = os.path.dirname(os.path.abspath(__file__))
    template_path = os.path.join(base_dir, "blog", "_template.html")
    output_path  = os.path.join(base_dir, "blog", f"post-{slug}.html")
    index_path   = os.path.join(base_dir, "blog", "index.html")

    # Verifica se o arquivo já existe
    if os.path.exists(output_path):
        print(f"Erro: blog/post-{slug}.html já existe. Escolha outro slug.")
        sys.exit(1)

    # Lê o template e substitui os tokens
    with open(template_path, "r", encoding="utf-8") as f:
        html = f.read()

    html = html.replace("__SLUG__",        slug)
    html = html.replace("__TITLE__",       title)
    html = html.replace("__DESCRIPTION__", description)
    html = html.replace("__CATEGORY__",    category)
    html = html.replace("__DATE__",        date_str)
    html = html.replace("__DATE_ISO__",    date_iso)
    html = html.replace("__READTIME__",    readtime)
    html = html.replace("__EMOJI__",       emoji)
    html = html.replace("__THUMB_CLASS__", thumb)

    with open(output_path, "w", encoding="utf-8") as f:
        f.write(html)
    print(f"✓ Post criado: blog/post-{slug}.html")

    # Adiciona o card no topo da grade em blog/index.html
    with open(index_path, "r", encoding="utf-8") as f:
        index = f.read()

    card = f"""
      <a href="post-{slug}.html" style="text-decoration:none;color:inherit">
        <div class="post-card">
          <div class="post-thumb {thumb}">
            {emoji}
            <span class="post-category">{category}</span>
          </div>
          <div class="post-body">
            <div class="post-meta">{date_str} · {readtime}</div>
            <h3>{title}</h3>
            <p>{description}</p>
            <span class="post-link">Ler artigo →</span>
          </div>
        </div>
      </a>
"""

    marker = '<div class="posts-grid">'
    if marker not in index:
        print("Erro: marcador posts-grid não encontrado em blog/index.html")
        sys.exit(1)

    index = index.replace(marker, marker + card, 1)

    with open(index_path, "w", encoding="utf-8") as f:
        f.write(index)
    print(f"✓ Card adicionado em blog/index.html")

    print(f"""
Próximos passos:
  1. Abra blog/post-{slug}.html e escreva o conteúdo do artigo
  2. Execute: ./publicar.sh "{title}"
""")

if __name__ == "__main__":
    main()
