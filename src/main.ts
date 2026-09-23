import "@fontsource/instrument-serif/latin-400.css";
import "@fontsource/pinyon-script/latin-400.css";
import "./styles/fonts.css";
import "./styles/main.css";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

import { blobMarkup, tickBlobs, followPointer } from "./lib/blob";
import { splitWords } from "./lib/split";
import { initIntro } from "./sections/intro";
import { initStory } from "./sections/story";
import { initContact } from "./sections/contact";

gsap.registerPlugin(ScrollTrigger);

const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- static characters (logo, thumbnails) ---------- */
document.querySelectorAll<HTMLElement>("[data-blob]").forEach((el) => {
  el.innerHTML = blobMarkup({ mouth: Number(el.dataset.blob), className: "blob--static" });
});
document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = String(new Date().getFullYear())));
document.querySelectorAll<HTMLElement>("[data-words]").forEach((el) => splitWords(el));

/* ---------- smooth scroll (Lenis) wired into GSAP's ticker ---------- */
let lenis: Lenis | null = null;
if (!reduced) {
  lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 0.9 });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis!.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}
gsap.ticker.add((_time, deltaMs) => tickBlobs(deltaMs / 1000));

/* ---------- sections ---------- */
const introBlob = initIntro(reduced);
const story = initStory();
initContact();

followPointer(document, (x, y) => {
  introBlob.setLook(x, y);
  story.blob.setLook(x, y);
});

/* ---------- nav links ---------- */
const targets: Record<string, () => number> = {
  top: () => 0,
  about: () => story.labelToScroll("about") + 2,
  work: () => story.labelToScroll("work") + window.innerHeight * 0.9,
  contact: () => document.getElementById("contact")!.offsetTop,
};
document.querySelectorAll<HTMLAnchorElement>("[data-scroll-to]").forEach((a) => {
  a.addEventListener("click", (e) => {
    const get = targets[a.dataset.scrollTo ?? ""];
    if (!get) return;
    e.preventDefault();
    const y = get();
    if (lenis) lenis.scrollTo(y, { duration: 1.6 });
    else window.scrollTo({ top: y });
  });
});

/* layout depends on web fonts */
document.fonts?.ready.then(() => ScrollTrigger.refresh());
