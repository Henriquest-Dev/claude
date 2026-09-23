import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { splitWords } from "../lib/split";

/** Scroll-triggered reveals shared by every dark section. */
export function initReveals(reduced: boolean): void {
  // Blocks fade up in batches as they enter
  const blocks = gsap.utils.toArray<HTMLElement>("[data-reveal]");
  gsap.set(blocks, { opacity: 0, y: reduced ? 0 : 40 });
  ScrollTrigger.batch(blocks, {
    start: "top 88%",
    once: true,
    onEnter: (batch) => {
      gsap.to(batch, { opacity: 1, y: 0, stagger: 0.09, duration: 0.9, ease: "power3.out", overwrite: true });
      batch.forEach((el) => el.classList.add("is-in"));
    },
  });

  // Section titles rise word by word
  document.querySelectorAll<HTMLElement>("[data-reveal-words]").forEach((title) => {
    const words = splitWords(title);
    gsap.from(words, {
      yPercent: reduced ? 0 : 70,
      opacity: 0,
      filter: reduced ? "none" : "blur(8px)",
      stagger: 0.05,
      duration: 0.9,
      ease: "power3.out",
      scrollTrigger: { trigger: title, start: "top 88%", once: true },
    });
  });

  // Number counters (+5 anos, 100%, 100/100)
  document.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => {
    const target = Number(el.dataset.count);
    const prefix = el.dataset.prefix ?? "";
    const n = { v: 0 };
    ScrollTrigger.create({
      trigger: el,
      start: "top 90%",
      once: true,
      onEnter: () =>
        gsap.to(n, {
          v: target,
          duration: reduced ? 0 : 1.6,
          ease: "power2.out",
          onUpdate: () => (el.textContent = prefix + Math.round(n.v)),
        }),
    });
  });

  if (reduced) return;

  // Gentle parallax inside the app videos
  document.querySelectorAll<HTMLElement>("[data-parallax]").forEach((box) => {
    const media = box.firstElementChild as HTMLElement;
    gsap.fromTo(media, { yPercent: -8 }, {
      yPercent: 0,
      ease: "none",
      scrollTrigger: { trigger: box, start: "top bottom", end: "bottom top", scrub: true },
    });
  });

  // About video grows into place
  const about = document.querySelector<HTMLElement>("[data-about-media]");
  if (about) {
    gsap.fromTo(about, { scale: 0.82, borderRadius: 60 }, {
      scale: 1,
      borderRadius: 28,
      ease: "none",
      scrollTrigger: { trigger: about, start: "top bottom", end: "center center", scrub: true },
    });
  }
}
