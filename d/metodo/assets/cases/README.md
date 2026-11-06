# Fotos e vídeos dos cases

Fotos vieram de komplexahoteis.com (Lagamar) e de komplexahoteis.com/d/aquisicao (Solar Dona Dora, Sunsmart, Bahia Bonita, Karandá). Estão embutidas no `index.html` em base64, recortadas em 420×560.

## Vídeo de depoimento
O deck procura `assets/cases/dona-dora.mp4`. Salve o vídeo do Solar Dona Dora com esse nome nesta pasta e ele aparece no modal do case (acima da tabela antes/depois), com player nativo. Se o arquivo não existir, o modal mostra só os números.

- Formato: MP4 (H.264 + AAC), vertical ou horizontal; o player usa até 300 px de altura.
- Para outros cases, adicione `video:'assets/cases/<slug>.mp4'` na entrada do case no array `CASES` do script.
- O vídeo não é embutido no HTML: a pasta `assets/cases/` precisa viajar junto com o `index.html` quando o deck for publicado.
