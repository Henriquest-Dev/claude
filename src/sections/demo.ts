import gsap from "gsap";
import { tr } from "../i18n";

/** Website showcase — 8 live websites, scrolled horizontally while pinned. */
const DEMOS = Array.from({ length: 8 }, (_, i) => String(i + 1).padStart(2, "0"));

export function initDemo(): void {
  const track = document.querySelector<HTMLElement>("[data-demo-track]")!;
  const indexEl = document.querySelector<HTMLElement>("[data-demo-index]")!;
  const bar = document.querySelector<HTMLElement>("[data-demo-progress]")!;
  const cta = tr("Quero um site assim", "I want a site like this");

  track.innerHTML = DEMOS.map(
    (n) => `
    <article class="site">
      <div class="site__media"><video data-src="./media/site-${n}.mp4" poster="./media/site-${n}.webp" muted loop playsinline preload="none" aria-label="Site ${n}"></video></div>
      <p class="site__foot"><span>Site ${n}</span><a class="link" href="#contacto">${cta} ↗</a></p>
    </article>`,
  ).join("");

  const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);

  gsap.to(track, {
    x: () => -distance(),
    ease: "none",
    scrollTrigger: {
      trigger: "#demonstracao",
      start: "top top",
      end: () => "+=" + distance(),
      pin: ".demo__pin",
      scrub: 1,
      invalidateOnRefresh: true,
      onUpdate(self) {
        const i = Math.min(DEMOS.length, Math.round(self.progress * (DEMOS.length - 1)) + 1);
        indexEl.textContent = String(i).padStart(2, "0");
        bar.style.transform = `scaleX(${0.125 + self.progress * 0.875})`;
      },
    },
  });
}
