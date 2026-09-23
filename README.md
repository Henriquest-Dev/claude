# Creative Studio — scroll-animated landing page

Recriação do site "Creative Studio" feito em Framer (logo com rosto que abre a boca conforme o scroll).

Abra `index.html` direto no navegador — não precisa de build nem dependências.

## Como funciona
- **Logo em SVG** (cabelo, coque com hashis, rosto, óculos, boca) fixo na tela.
- **5 variantes** (igual às "Scroll Variants" do Framer, trigger *Section in View*, replay ativado):
  1. Rosto pequeno, boca em "o"
  2. Rosto cresce, boca abre
  3. Zoom — boca bem aberta
  4. Boca toma o rosto (vira um anel), óculos sobem
  5. Boca engole a tela → seção preta com o texto e o marquee de marcas
- Transições com **spring** (stiffness/damping) como no Framer, pupilas seguem o mouse.
- Texto final aparece palavra por palavra com blur; logos passam em loop infinito.

## Personalizar
- Nome no canto: procure `Seu Nome` no `index.html`.
- Cores: variáveis `--red`, `--peach`, `--black` no topo do CSS.
- Tamanhos/posições de cada variante: array `VARIANTS` no script.
- Mola: `SPRING = { stiffness, damping, mass }`.
