import { defineConfig, loadEnv, type Plugin } from "vite";

/**
 * SEO files generated from .env on every build, so changing VITE_SITE_URL
 * (e.g. to a custom domain) updates everything at once:
 *   - sitemap.xml  (PT + EN versions, with hreflang alternates)
 *   - robots.txt   (points crawlers to the sitemap)
 *   - 404.html     (GitHub Pages error page, links built from the site URL)
 *   - Google Search Console verification meta tag (only if the code is set)
 */
function seo(env: Record<string, string>): Plugin {
  const site = (env.VITE_SITE_URL || "/").replace(/\/?$/, "/");
  const today = new Date().toISOString().slice(0, 10);
  const pt = site;
  const en = `${site}?lang=en`;
  const alternates = `
    <xhtml:link rel="alternate" hreflang="pt" href="${pt}" />
    <xhtml:link rel="alternate" hreflang="en" href="${en.replace("&", "&amp;")}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${pt}" />`;

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>${pt}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>${alternates}
  </url>
  <url>
    <loc>${en}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>${alternates}
  </url>
</urlset>
`;

  const robots = `User-agent: *
Allow: /

Sitemap: ${site}sitemap.xml
`;

  const notFound = `<!doctype html>
<html lang="pt-PT">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="robots" content="noindex" />
    <title>Página não encontrada — HAV Agency</title>
    <link rel="icon" href="${site}favicon.svg" type="image/svg+xml" />
    <style>
      body { margin: 0; min-height: 100vh; display: grid; place-items: center; background: #5ad64c; color: #111; font-family: system-ui, sans-serif; text-align: center; padding: 24px; }
      h1 { font-size: clamp(64px, 14vw, 160px); margin: 0; letter-spacing: -0.06em; line-height: 0.9; }
      p { font-size: 18px; margin: 16px 0 28px; }
      a { display: inline-block; padding: 14px 22px; border-radius: 999px; background: #111; color: #fff; text-decoration: none; font-weight: 600; }
    </style>
  </head>
  <body>
    <main>
      <h1>404</h1>
      <p>Esta página não existe. · This page doesn't exist.</p>
      <a href="${site}">Voltar ao início · Back home</a>
    </main>
  </body>
</html>
`;

  return {
    name: "hav-seo",
    transformIndexHtml(html) {
      const code = env.VITE_GOOGLE_SITE_VERIFICATION?.trim();
      const tag = code ? `<meta name="google-site-verification" content="${code}" />` : "";
      return html.replace("<!--google-site-verification-->", tag);
    },
    generateBundle() {
      this.emitFile({ type: "asset", fileName: "sitemap.xml", source: sitemap });
      this.emitFile({ type: "asset", fileName: "robots.txt", source: robots });
      this.emitFile({ type: "asset", fileName: "404.html", source: notFound });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "VITE_");
  return {
    // Relative base so the build works on GitHub Pages, a custom domain or any sub-folder
    base: "./",
    plugins: [seo(env)],
    build: {
      target: "es2020",
      cssCodeSplit: false,
      assetsInlineLimit: 2048,
    },
  };
});
