#!/bin/bash
# Publica posts novos/alterados no GitHub.
# Uso: ./publicar.sh "Título do post"

TITLE="${1:-"Novo post"}"

cd "$(dirname "$0")"

echo "Verificando alterações em blog/..."
git status blog/

echo ""
echo "Commitando..."
git add blog/
git commit -m "post: $TITLE"

echo ""
echo "Enviando para o GitHub..."
git push

echo ""
echo "✓ Publicado: $TITLE"
