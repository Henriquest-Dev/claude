# Portfólio — Henriquest

Site de portfólio com o personagem verde, animações de scroll no estilo Framer (scroll variants com spring) e cenas roteirizadas pelo scroll (pin + scrub).

## Tecnologias
- **Vite + TypeScript**: build rápido, código tipado, bundle minificado
- **GSAP + ScrollTrigger**: cenas fixas (pin) e animações ligadas ao scroll (scrub)
- **Lenis**: scroll suave
- **Fontsource**: fontes hospedadas no próprio site (só o subconjunto latino: Instrument Serif, Pinyon Script, Inter)
- Personagem 100% em **SVG** (sem imagens pesadas), com mola própria (stiffness/damping/mass, igual ao Framer)

## Rodar
```bash
npm install
npm run dev       # desenvolvimento em http://localhost:5173
npm run build     # gera a versão otimizada em dist/
npm run preview   # testa a versão de produção
```

## Personalizar
- **Nome, e-mail, redes, localização**: arquivo `.env` (depois rode `npm run build`)
- **Textos**: `index.html` (todo o conteúdo está no HTML, bom para SEO)
- **Cores**: variáveis `--green`, `--ink`, … no topo de `src/styles/main.css`
- **Personagem / bocas**: `src/lib/blob.ts` (array `MOUTHS` = os 6 quadros)
- **Mola das variantes**: `FRAMER_SPRING` em `src/lib/spring.ts`
- **Sequência do scroll**: `src/sections/story.ts` (timeline com labels `about`, `process`, `work`, `exit`)

## Estrutura do scroll
1. **Intro**: 6 quadros do personagem (a boca vai abrindo, com o fundo alternando preto/verde) → a boca engole a tela → texto + marquee de ferramentas
2. **Íris**: um círculo abre no preto e revela a história
3. **História (fixa na tela)**: título some com blur → cursor de design "pega" o personagem → flash → novo título → post-its entram e saem → cards de projetos entram pelos lados → tudo sai
4. **Contato**: título com letras cursivas, e-mail, e vários personagens subindo por baixo

## Publicar
- **GitHub Pages**: cada push na `main` roda o workflow `.github/workflows/deploy.yml`, que gera o site e publica na branch `gh-pages`. Endereço: https://henriquest-dev.github.io/claude/
- **Vercel / Netlify**: build `npm run build`, pasta `dist`.

## Otimizações
- JS ~55 kB gzip, CSS ~5 kB gzip, fontes só em latim (woff2)
- Nenhuma imagem no site além do ícone e da imagem de compartilhamento
- Respeita *reduzir movimento* do sistema (desliga o scroll suave e a mola)
- Metatags de SEO e Open Graph, favicon SVG, `robots.txt`
