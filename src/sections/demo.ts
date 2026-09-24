import { tr } from "../i18n";

/** Builds the 8 website cards of the showcase scene (animated by the stage timeline). */
export function buildDemo(): void {
  const track = document.querySelector<HTMLElement>("[data-demo-track]")!;
  const cta = tr("Quero um site assim", "I want a site like this");
  track.innerHTML = Array.from({ length: 8 }, (_, i) => {
    const n = String(i + 1).padStart(2, "0");
    return `
    <article class="site">
      <div class="site__media"><video data-src="./media/site-${n}.mp4" poster="./media/site-${n}.webp" muted loop playsinline preload="none" aria-label="Site ${n}"></video></div>
      <p class="site__foot"><span>Site ${n}</span><a class="link" href="#contacto" data-scroll-to="contact">${cta} ↗</a></p>
    </article>`;
  }).join("");
}
