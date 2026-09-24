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

  document.querySelectorAll<HTMLAnchorElement>("a[data-scroll-to]").forEach((a) => {
    a.addEventListener("click", (e) => {
      const get = extraTargets[a.dataset.scrollTo!];
      if (!get) return;
      e.preventDefault();
      if (!menu.hidden) setMenu(false);
      scrollTo(get());
    });
  });

  // After the intro everything is green, so the nav stays dark-on-green
  ScrollTrigger.create({
    trigger: "#story",
    start: "top -100%",
    end: "max",
    onToggle: (self) => self.isActive && setTheme("light"),
  });
  if (window.scrollY > window.innerHeight * 8) setTheme("light");

  const onScroll = () => document.body.classList.toggle("is-scrolled", window.scrollY > 40);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}
