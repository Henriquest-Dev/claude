import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { splitWords } from "../lib/split";

/**
 * Entrances for the green world — the same language as the pinned story:
 * words rise out of a blur, blocks fade up, media opens like a curtain.
 */
export function initReveals(reduced: boolean): void {
  // Blocks fade up (with a touch of blur) in batches
  const blocks = gsap.utils.toArray<HTMLElement>("[data-reveal]");
  gsap.set(blocks, { opacity: 0, y: reduced ? 0 : 36, filter: reduced ? "none" : "blur(6px)" });
  ScrollTrigger.batch(blocks, {
    start: "top 90%",
    once: true,
    onEnter: (batch) =>
      gsap.to(batch, { opacity: 1, y: 0, filter: "blur(0px)", stagger: 0.08, duration: 0.9, ease: "power3.out", overwrite: true }),
  });

  // Titles rise word by word out of a blur
  document.querySelectorAll<HTMLElement>("[data-reveal-words]").forEach((title) => {
    const words = splitWords(title);
    gsap.from(words, {
      yPercent: reduced ? 0 : 60,
      opacity: 0,
      filter: reduced ? "none" : "blur(10px)",
      stagger: 0.05,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: { trigger: title, start: "top 88%", once: true },
    });
  });

  // Counters
  document.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => {
    const target = Number(el.dataset.count);
    const prefix = el.dataset.prefix ?? "";
    const n = { v: 0 };
    ScrollTrigger.create({
      trigger: el,
      start: "top 92%",
      once: true,
      onEnter: () =>
        gsap.to(n, { v: target, duration: reduced ? 0 : 1.6, ease: "power2.out", onUpdate: () => (el.textContent = prefix + Math.round(n.v)) }),
    });
  });

  // Services: the row crossing the middle of the screen is in focus
  const rows = document.querySelectorAll<HTMLElement>("[data-focus]");
  if (rows.length) {
    document.body.classList.add("js-focus");
    rows.forEach((row) =>
      ScrollTrigger.create({
        trigger: row,
        start: "top 62%",
        end: "bottom 38%",
        toggleClass: "is-active",
      }),
    );
  }

  // Media opens like a curtain, scrubbed with the scroll
  document.querySelectorAll<HTMLElement>("[data-reveal-media]").forEach((box) => {
    if (reduced) return;
    gsap.fromTo(
      box,
      { clipPath: "inset(12% 8% 12% 8% round 24px)" },
      {
        clipPath: "inset(0% 0% 0% 0% round 24px)",
        ease: "none",
        scrollTrigger: { trigger: box, start: "top 95%", end: "top 45%", scrub: true },
      },
    );
  });
}
