import gsap from "gsap";

/** "Demonstração dos sites" — 8 live websites, scrolled horizontally while pinned. */
const DEMOS = Array.from({ length: 8 }, (_, i) => {
  const n = String(i + 1).padStart(2, "0");
  return { n, src: `./media/site-${n}.mp4`, poster: `./media/site-${n}.webp` };
});

export function initDemo(): void {
  const track = document.querySelector<HTMLElement>("[data-demo-track]")!;
  const indexEl = document.querySelector<HTMLElement>("[data-demo-index]")!;
  const bar = document.querySelector<HTMLElement>("[data-demo-progress]")!;

  track.innerHTML = DEMOS.map(
    (d) => `
    <article class="site">
      <div class="site__bar"><i></i><i></i><i></i><span>Site ${d.n}</span></div>
      <div class="site__media"><video data-src="${d.src}" poster="${d.poster}" muted loop playsinline preload="none" aria-label="Demonstração do site ${d.n}"></video></div>
      <div class="site__foot"><b>${d.n} / 08 · Website em funcionamento</b><a class="link-arrow" href="#contacto">Quero um site assim <span aria-hidden="true">↗</span></a></div>
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
