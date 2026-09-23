import type Lenis from "lenis";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { setTheme } from "../lib/theme";

/** Anchor scrolling, mobile menu and nav colour per section. */
export function initNav(lenis: Lenis | null, extraTargets: Record<string, () => number>): void {
  const burger = document.querySelector<HTMLButtonElement>(".nav__burger")!;
  const menu = document.getElementById("menu")!;

  const setMenu = (open: boolean) => {
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    menu.hidden = !open;
    document.body.classList.toggle("menu-open", open);
    if (open) lenis?.stop();
    else lenis?.start();
  };
  burger.addEventListener("click", () => setMenu(menu.hidden));
  document.addEventListener("keydown", (e) => e.key === "Escape" && !menu.hidden && setMenu(false));

  const scrollTo = (y: number) => {
    if (lenis) lenis.scrollTo(y, { duration: 1.6 });
    else window.scrollTo({ top: y });
  };

  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const key = a.dataset.scrollTo;
      const id = a.getAttribute("href")!.slice(1);
      const el = id ? document.getElementById(id) : null;
      let y: number | null = null;
      if (key && extraTargets[key]) y = extraTargets[key]();
      else if (el) y = el.getBoundingClientRect().top + window.scrollY;
      if (y === null) return;
      e.preventDefault();
      if (!menu.hidden) setMenu(false);
      scrollTo(y);
    });
  });

  // Nav colour: dark sections vs green scenes
  const zones: [string, "light" | "dark", string?][] = [
    ["#story", "light", "top -100%"],
    ["#servicos", "dark"],
    ["#demonstracao", "dark"],
    ["#aplicativos", "dark"],
    ["#anuncios", "dark"],
    ["#projetos", "dark"],
    ["#sobre", "dark"],
    ["#contacto", "light"],
  ];
  zones.forEach(([sel, theme, start]) =>
    ScrollTrigger.create({
      trigger: sel,
      start: start ?? "top 40px",
      end: "bottom 40px",
      onToggle: (self) => self.isActive && setTheme(theme),
    }),
  );

  const onScroll = () => document.body.classList.toggle("is-scrolled", window.scrollY > 40);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}
