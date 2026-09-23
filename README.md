# HAV Agency — site

Site da HAV Agency com o mascote verde (slime), animações de scroll no estilo Framer (variantes com mola) e cenas controladas pela rolagem (pin + scrub). O conteúdo vem do portfólio antigo (havagency.space).

**Online:** https://henriquest-dev.github.io/claude/

## Estrutura da página
1. **Intro**: 6 quadros do slime (a boca vai abrindo) → a boca engole a tela → frase + marquee
2. **Íris**: um círculo abre no preto e revela a cena seguinte
3. **Cena fixa**: título some → o cursor "pega" o slime → flash → post-its do processo → cards com vídeos (site, app, anúncio)
4. **Serviços**: 6 serviços com widgets animados (barras, score 100/100, ROAS, funil)
5. **Demonstração**: os 8 sites em vídeo, numa galeria horizontal controlada pela rolagem
6. **Aplicativos**: 4 apps com vídeo e parallax
7. **Anúncios**: 5 anúncios 9:16 em moldura de telemóvel, com botão de som
8. **Projetos**: 6 projetos com filtros animados (GSAP Flip)
9. **Sobre**: vídeo da equipa + contadores
10. **Contacto**: canais diretos + formulário que abre o WhatsApp/email com a mensagem pronta, e os slimes subindo por baixo

## Tecnologias
Vite + TypeScript · GSAP (ScrollTrigger, Flip) · Lenis · fonte **Outfit** em todo o site (auto-hospedada, só latim) · personagem em SVG.

## Rodar
```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # versão otimizada em dist/
```

## Editar
| O quê | Onde |
|---|---|
| Nome, email, WhatsApp, Instagram | `.env` |
| Textos das secções | `index.html` |
| Sites da demonstração | `src/sections/demo.ts` + vídeos `public/media/site-XX.mp4` |
| Anúncios | `src/sections/ads.ts` + `public/media/ad-XX.mp4` |
| Projetos | `src/sections/projects.ts` |
| Cores | topo de `src/styles/main.css` |
| Personagem / bocas | `src/lib/blob.ts` |
| Sequência da cena fixa | `src/sections/story.ts` |

**Trocar um vídeo:** coloque o `.mp4` em `public/media/` com o mesmo nome (ex.: `site-03.mp4`) e uma imagem `.webp` do primeiro frame com o mesmo nome.

## Publicar
Cada push na `main` roda `.github/workflows/deploy.yml`, que gera o site e publica na branch `gh-pages` (GitHub Pages).

## Otimizações
- Vídeos comprimidos (48 MB → 14,6 MB) e carregados só quando aparecem na tela; pausam ao sair
- Imagem de pré-visualização (webp) em cada vídeo
- JS ~68 kB gzip, uma única fonte (woff2, subset latino)
- Respeita "reduzir movimento" (sem scroll suave, sem autoplay)
- SEO e Open Graph, favicon, `robots.txt`
