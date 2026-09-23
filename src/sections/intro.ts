import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";
import { BlobController, MOUTH_CENTER } from "../lib/blob";
import { setTheme } from "../lib/theme";

/**
 * Framer-style "Scroll Variants": trigger = section in view, replay = yes.
 * Each viewport of scroll swaps the character to the next frame with a spring.
 */
const VARIANTS = [
  { mouth: 0, s: 0.5, bg: "black" },
  { mouth: 1, s: 0.55, bg: "green" },
  { mouth: 2, s: 0.6, bg: "black" },
  { mouth: 3, s: 0.66, bg: "green" },
  { mouth: 4, s: 0.73, bg: "black" },
  { mouth: 5, s: 0.82, bg: "green" },
] as const;

const SWALLOW_INDEX = VARIANTS.length;

export function initIntro(reduced: boolean): BlobController {
  const stage = document.querySelector<HTMLElement>(".intro__stage")!;
  const dots = [...stage.querySelectorAll<HTMLLIElement>(".intro__steps li")];
  const blob = new BlobController(document.getElementById("intro-blob")!, {
    mouth: 0,
    scale: 0.001,
    instant: reduced,
  });

  let current = -1;
  const apply = (i: number) => {
    if (i === current) return;
    current = i;
    const swallowed = i >= SWALLOW_INDEX;
    stage.classList.toggle("is-swallowed", swallowed);
    dots.forEach((d, k) => d.classList.toggle("is-active", k === Math.min(i, VARIANTS.length - 1)));

    if (swallowed) {
      // the mouth opens past the edges of the screen
      blob.setMouth(5);
      blob.setRig({ s: 11, fx: MOUTH_CENTER.x, fy: MOUTH_CENTER.y, tx: 0, ty: 0 });
      stage.dataset.bg = "black";
    } else {
      const v = VARIANTS[i];
      blob.setMouth(v.mouth);
      blob.setRig({ s: v.s, fx: 200, fy: 200, tx: 0, ty: 0 });
      stage.dataset.bg = v.bg;
    }
  };

  let irisProgress = 0;
  const updateTheme = () => {
    const bg = stage.dataset.bg;
    setTheme(irisProgress > 0.45 ? "light" : bg === "green" ? "light" : "dark");
  };

  ScrollTrigger.create({
    trigger: "#intro",
    start: "top top",
    end: "bottom bottom",
    onUpdate(self) {
      const scrolled = self.scroll() - self.start;
      const i = Math.max(0, Math.min(SWALLOW_INDEX, Math.floor(scrolled / window.innerHeight + 0.5)));
      apply(i);
      updateTheme();
    },
  });

  // Iris opens a hole in the black screen, revealing the story underneath
  gsap.fromTo(
    stage,
    { "--iris": 0 },
    {
      "--iris": 101,
      ease: "power1.in",
      scrollTrigger: {
        trigger: "#intro",
        start: "bottom bottom+=100%",
        end: "bottom bottom",
        scrub: true,
        onUpdate(self) {
          irisProgress = self.progress;
          stage.classList.toggle("is-open", self.progress >= 0.999);
          updateTheme();
        },
      },
    },
  );

  apply(0);
  // pop in on load
  requestAnimationFrame(() => blob.setRig({ s: VARIANTS[0].s }));
  return blob;
}
