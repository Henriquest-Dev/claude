import "./styles/fonts.css";
import "./styles/main.css";

import { applyTranslations, initLangSwitch, takeSavedScroll } from "./i18n";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

import { blobMarkup, tickBlobs, followPointer } from "./lib/blob";
import { splitWords } from "./lib/split";
import { initVideos } from "./lib/media";
import { initIntro } from "./sections/intro";
import { initStory } from "./sections/story";
import { buildDemo } from "./sections/demo";
import { buildAds } from "./sections/ads";
import { buildProjects } from "./sections/projects";
import { buildCrowd, initForm } from "./sections/contact";
import { initNav } from "./sections/nav";

gsap.registerPlugin(ScrollTrigger);

const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- language first: every animation is built from the final text ---------- */
document.documentElement.classList.add("js");
applyTranslations();
initLangSwitch();

/* ---------- static characters (logos) ---------- */
document.querySelectorAll<HTMLElement>("[data-blob]").forEach((el) => {
  el.innerHTML = blobMarkup({ mouth: Number(el.dataset.blob), className: "blob--static" });
});
document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = String(new Date().getFullYear())));
document.querySelectorAll<HTMLElement>("[data-words]").forEach((el) => splitWords(el));

/* ---------- build generated content before the stage timeline reads it ---------- */
buildDemo();
buildAds();
buildProjects();
buildCrowd();

/* ---------- smooth scroll (Lenis) wired into GSAP's ticker ---------- */
let lenis: Lenis | null = null;
if (!reduced) {
  lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 0.9 });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis!.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}
gsap.ticker.add((_time, deltaMs) => tickBlobs(deltaMs / 1000));

/* ---------- the intro, then ONE pinned stage for everything else ---------- */
const introBlob = initIntro(reduced);
const story = initStory();
initVideos(reduced);
initForm(lenis);

followPointer(document, (x, y) => {
  introBlob.setLook(x, y);
  story.blob.setLook(x, y);
});

const go = (label: string) => () => story.scrollTo(label);
initNav(lenis, {
  top: () => 0,
  services: go("services"),
  demo: go("demo"),
  projects: go("projects"),
  about: go("about"),
  contact: go("contact"),
});

/* layout depends on the web font; then restore the position kept by the PT/EN switch */
const saved = takeSavedScroll();
document.fonts?.ready.then(() => {
  ScrollTrigger.refresh();
  if (saved !== null) {
    window.scrollTo(0, saved);
    lenis?.scrollTo(saved, { immediate: true });
  }
});
