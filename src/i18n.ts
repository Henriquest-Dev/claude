/* ------------------------------------------------------------------
   PT / EN. Portuguese lives in index.html; English replaces it at start-up.
   Switching language reloads the page on the same scroll position, so every
   scroll animation is built from the right text.
   ------------------------------------------------------------------ */

export type Lang = "pt" | "en";

const STORE_KEY = "hav-lang";
const SCROLL_KEY = "hav-scroll";

function detect(): Lang {
  const q = new URLSearchParams(location.search).get("lang");
  if (q === "pt" || q === "en") return q;
  try {
    const saved = localStorage.getItem(STORE_KEY);
    if (saved === "pt" || saved === "en") return saved;
  } catch {
    /* storage blocked */
  }
  return navigator.language?.toLowerCase().startsWith("pt") ? "pt" : "en";
}

export const lang: Lang = detect();

/** Pick the right string for the current language. */
export const tr = <T,>(pt: T, en: T): T => (lang === "en" ? en : pt);

const EN: Record<string, string> = {
  "meta.title": "HAV Agency — Digital Solutions &amp; Marketing",
  "meta.desc": "HAV Agency builds websites, apps, digital solutions, low-cost advertising and marketing strategies for businesses and entrepreneurs.",
  skip: "Skip to contact",
  "nav.home": "Home",
  "nav.services": "Services",
  "nav.demo": "Showcase",
  "nav.projects": "Projects",
  "nav.about": "About",
  "nav.contact": "Contact",
  "nav.cta": "Let's talk",
  "menu.label": "Navigation",

  "intro.statement": `HAV Agency turns ideas into <em class="c1">digital solutions:</em> <em class="c2">websites,</em> <em class="c3">apps,</em> <em class="c4">advertising</em> &amp; <em class="c1">marketing.</em>`,
  "intro.marquee": "<li>Strategy</li><li>Technology</li><li>Creativity</li><li>Websites</li><li>Apps</li><li>Advertising</li><li>Marketing</li><li>Consulting</li>",

  "s1.title": `We turn <br />ideas into <br />digital <em class="hl">solutions.</em>`,
  "s1.copy": "Consulting, websites, apps, advertising and marketing for businesses that want to grow with technology and strategy.",
  "s1.cardTitle": "Strategic solutions, tailor-made",
  "s1.cardList": "<div><dt>Consulting</dt><dd>Diagnosis</dd></div><div><dt>Websites</dt><dd>100/100</dd></div><div><dt>Apps</dt><dd>iOS &amp; Android</dd></div><div><dt>Advertising</dt><dd>ROAS 4.8x</dd></div><div><dt>Marketing</dt><dd>+180% reach</dd></div><div><dt>Digital solutions</dt><dd>Custom-built</dd></div>",
  "s1.cardBtn": "See our services",
  "s1.cardNote": "Strategy • Technology • Creativity",
  "s1.selection": "HAV Mascot · 320 × 320",

  "s2.title": `Think growing online <br /><em class="hl">happens</em> by chance?`,
  "s2.note1": "<b>01 · Diagnosis</b>Strategic guidance to spot opportunities and define the best path for your project.",
  "s2.note2": "<b>02 · Design &amp; Web</b>Modern, fast, responsive websites with technical SEO and editorial design.",
  "s2.note3": "<b>03 · Ads</b>High-converting creatives with a low cost per click for Instagram, Meta &amp; Google.",
  "s2.note4": "<b>04 · Growth</b>Positioning, content and a conversion funnel focused on the customer.",
  "s2.label": "Strong brands aren't<br />built overnight.",
  "s2.cardMain": `<h3>Website showcase</h3><h4>Modern architecture &amp; technical SEO</h4><p>Editorial, responsive design that loads instantly.</p><h4>Live projects</h4><p>8 real websites — see them next.</p><p class="card__hl">Websites · Web design · Performance</p>`,
  "s2.cardA": "Apps for iOS &amp; Android",
  "s2.cardB": "9:16 ads that convert",
  "s2.copy": "Consulting, websites, apps, advertising and marketing — all under one roof.",

  "svc.eyebrow": "What we do",
  "svc.title": `Strategic solutions, <em class="hl">tailor-made.</em>`,
  "svc.lead": "We build digital solutions designed to deliver authority, efficiency and a real impact on sales.",
  "svc.1": "<h3>Consulting</h3><p>Strategic guidance to shape ideas, spot opportunities and define the best path for your project.</p><small>Diagnosis · Tech roadmap · Business model</small>",
  "svc.2": "<h3>Websites</h3><p>Modern, fast, responsive and professional websites for companies, brands, services and projects.</p><small>Technical SEO · Editorial design · High performance</small>",
  "svc.3": "<h3>Apps</h3><p>Custom applications that turn processes, services and ideas into digital experiences.</p><small>iOS &amp; Android · Web apps · Automation</small>",
  "svc.4": "<h3>Advertising</h3><p>Efficient ads and creatives that promote products and services without big budgets.</p><small>High-converting creatives · Instagram, Meta &amp; Google</small>",
  "svc.5": "<h3>Marketing</h3><p>Digital strategies to raise visibility, position your brand and attract customers online.</p><small>Digital branding · Campaigns · Conversion funnel</small>",
  "svc.6": "<h3>Digital solutions</h3><p>Custom solutions that blend technology, creativity and strategy for specific needs.</p><small>Integrations · Dashboards · Workflow digitisation</small>",

  "demo.eyebrow": "Live projects",
  "demo.title": "Website showcase.",

  "apps.eyebrow": "Mobile apps",
  "apps.title": `Projects for <em class="hl">iOS and Android.</em>`,
  "apps.lead": "Native apps designed for speed, user retention and intuitive usability on mobile devices.",
  "apps.1": "<p class=\"app__meta\">01 / 04 · Education &amp; Interface</p><h3>Learn UI/UX &amp; Design</h3><p>An interactive platform to master interface design, UI/UX theory, typography and prototyping through hands-on exercises.</p>",
  "apps.2": "<p class=\"app__meta\">02 / 04 · Health &amp; Nutrition</p><h3>Nutrition &amp; Fitness Tracker</h3><p>Daily tracking of calories and macros, smart meal logging and workout plans for fitness goals.</p>",
  "apps.3": "<p class=\"app__meta\">03 / 04 · Mobility &amp; GPS</p><h3>Real-Time Vehicle Tracking</h3><p>Precise live vehicle location on the map, safety alerts, detailed route history and 24/7 monitoring.</p>",
  "apps.4": "<p class=\"app__meta\">04 / 04 · Travel &amp; Leisure</p><h3>Destinations &amp; Travel Guide</h3><p>Discover destinations, local cultural guides, personalised itineraries and easy booking for your next trip.</p>",
  "apps.cta": "I want an app like this ↗",

  "ads.eyebrow": "Advertising &amp; ads",
  "ads.title": `Ads made by <em class="hl">HAV Agency.</em>`,
  "ads.lead": "Vertical 9:16 videos for Reels, Stories and TikTok — built to grab attention in the first seconds and turn views into leads.",
  "ads.cta": "Need ads that convert? Let's talk ↗",

  "proj.eyebrow": "Project portfolio",
  "proj.title": `Selected <em class="hl">work.</em>`,
  "proj.all": "All",
  "proj.apps": "Apps",
  "proj.ads": "Advertising",

  "about.eyebrow": "About HAV Agency",
  "about.title": `Technology, strategy and a <em class="hl">long-term</em> vision.`,
  "about.p1": "HAV Agency was born to make high technology and premium design accessible to companies that want to lead their industries.",
  "about.p2": "We don't make generic products. Every line of code, visual transition and content structure is built to create authority, speed and return.",
  "about.s1": "Years of digital experience",
  "about.s2": "Focus on performance",
  "about.s3": "User-centred design",

  "contact.eyebrow": "Start a project",
  "contact.title": `Shall we build <br />your <em class="hl">digital presence?</em>`,
  "contact.copy": "Talk to us today. We'll look at your goals and propose the best technical and strategic approach.",
  "contact.wa": "WhatsApp",
  "form.name": "Name or company *",
  "form.phone": "Phone / WhatsApp (optional)",
  "form.service": "Which service do you need?",
  "form.options": "<option>Website Development</option><option>App Development</option><option>Strategic Consulting</option><option>Low-Cost Advertising</option><option>Digital Marketing &amp; Growth</option><option>Other Custom Project</option>",
  "form.message": "Describe your idea or need *",
  "form.wa": "Send via WhatsApp ↗",
  "form.email": "Send by email",
  "form.note": "When you send, we open WhatsApp or your email app with the message ready.",
  "footer.top": "Top ↑",
  "footer.rights": "All rights reserved.",
};

/** Swap every [data-i18n] node to English (called before anything else runs). */
export function applyTranslations(): void {
  document.documentElement.lang = lang === "en" ? "en" : "pt-PT";
  document.querySelectorAll<HTMLButtonElement>("[data-lang]").forEach((b) =>
    b.setAttribute("aria-pressed", String(b.dataset.lang === lang)),
  );
  if (lang !== "en") return;

  document.querySelectorAll<HTMLElement>("[data-i18n]").forEach((el) => {
    const v = EN[el.dataset.i18n!];
    if (v !== undefined) el.innerHTML = v;
  });
  document.querySelectorAll<HTMLElement>("[data-i18n-attr]").forEach((el) => {
    const [attr, key] = el.dataset.i18nAttr!.split(":");
    if (EN[key]) el.setAttribute(attr, EN[key]);
  });
  document.title = document.title.replace("&amp;", "&");
}

/** Language buttons: remember the choice and reload at the same scroll position. */
export function initLangSwitch(): void {
  document.querySelectorAll<HTMLButtonElement>("[data-lang]").forEach((btn) =>
    btn.addEventListener("click", () => {
      const next = btn.dataset.lang as Lang;
      if (next === lang) return;
      try {
        localStorage.setItem(STORE_KEY, next);
        sessionStorage.setItem(SCROLL_KEY, String(Math.round(window.scrollY)));
      } catch {
        /* storage blocked — still switch */
      }
      const url = new URL(location.href);
      url.searchParams.delete("lang");
      url.hash = "";
      location.replace(url.toString());
    }),
  );
}

/** Scroll position saved by the switch (read once). */
export function takeSavedScroll(): number | null {
  try {
    const v = sessionStorage.getItem(SCROLL_KEY);
    sessionStorage.removeItem(SCROLL_KEY);
    return v === null ? null : Number(v);
  } catch {
    return null;
  }
}
