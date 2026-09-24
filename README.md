# HAV Agency — site

Site da HAV Agency com o mascote verde (slime), animações de scroll no estilo Framer (variantes com mola) e cenas controladas pela rolagem (pin + scrub). O conteúdo vem do portfólio antigo (havagency.space).

**Online:** https://havagency.space/ (cópia também em https://henriquest-dev.github.io/claude/)

## Estrutura da página
1. **Intro**: 6 quadros do slime (a boca vai abrindo) → a boca engole a tela → frase + marquee. Aviso centrado "Continua a rolar".
2. **Íris**: um círculo abre no preto e revela o palco.
3. **Um único palco fixo para o resto do site** (`src/sections/story.ts`), controlado pela rolagem, como no vídeo de referência: herói → o cursor pega o slime → processo (post-its) → serviços (um de cada vez) → demonstração dos 8 sites (a fita desliza) → apps (slides) → anúncios (telemóveis sobem) → projetos → sobre (contadores) → contacto (os slimes sobem por baixo). O slime acompanha as cenas.
4. **Formulário**: abre numa janela ("Escrever mensagem") e envia pelo WhatsApp ou email com a mensagem pronta.

## Idiomas (PT/EN)
O português está no `index.html`; o inglês fica em `src/i18n.ts` (mesmas chaves `data-i18n`). Textos gerados por script (sites, anúncios, projetos, mensagem do formulário) usam `tr(pt, en)` no próprio ficheiro. O botão PT/EN guarda a escolha e recarrega na mesma posição; visitantes com o navegador em inglês veem inglês por padrão. Link direto: `?lang=en` ou `?lang=pt`.

## Tecnologias
Vite + TypeScript · GSAP (ScrollTrigger) · Lenis · fonte **Outfit** em todo o site (auto-hospedada, só latim) · personagem em SVG.

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
| Velocidade do scroll (ecrãs por unidade) | constante `K` em `src/sections/story.ts` |
| Cores | topo de `src/styles/main.css` |
| Personagem / bocas | `src/lib/blob.ts` |
| Sequência das cenas (ordem, tempos, posições do slime) | `src/sections/story.ts` |

**Trocar um vídeo:** coloque o `.mp4` em `public/media/` com o mesmo nome (ex.: `site-03.mp4`) e uma imagem `.webp` do primeiro frame com o mesmo nome.

## Publicar
Cada push na `main` roda `.github/workflows/deploy.yml`, que gera o site e publica na branch `gh-pages` (GitHub Pages).

## SEO (Google)
Gerado a partir do `.env` em cada build (`vite.config.ts`):
- `sitemap.xml` (versão PT `/` e EN `/?lang=en`, com `hreflang`), `robots.txt` (aponta para o sitemap) e `404.html`
- `<link rel="canonical">`, `hreflang` pt/en/x-default, título e descrição por língua
- Dados estruturados Schema.org (`ProfessionalService` + `WebSite`) com contactos, Instagram e serviços
- Open Graph / Twitter (imagem 1200×630), `site.webmanifest`
- Verificação do Google Search Console: cole o código em `VITE_GOOGLE_SITE_VERIFICATION` no `.env` e faça push
- Robôs de pesquisa recebem sempre a página tal como publicada (PT em `/`, EN em `/?lang=en`)

**Mudar para um domínio próprio:** altere `VITE_SITE_URL` no `.env` (ex.: `https://havagency.space/`) e tudo acima é atualizado.

## Otimizações
- Vídeos comprimidos e carregados só quando a sua cena está visível; pausam ao sair
- Imagem de pré-visualização (webp) em cada vídeo
- JS ~68 kB gzip, uma única fonte (woff2, subset latino)
- Respeita "reduzir movimento" (sem scroll suave, sem autoplay)
- SEO e Open Graph, favicon, `robots.txt`
