import gsap from "gsap";
import { BlobController } from "../lib/blob";

/**
 * Pinned, scroll-scrubbed story (the dynamic from the reference video):
 * hero copy blurs away → cursor grabs the character → flash → new headline,
 * sticky notes fly in and out → work cards slide in from both sides → everything exits.
 */
export function initStory(): { blob: BlobController; labelToScroll: (label: string) => number } {
  const q = <T extends Element = HTMLElement>(s: string) => document.querySelector<T>(s)!;
  const qa = <T extends Element = HTMLElement>(s: string) => [...document.querySelectorAll<T>(s)];

  const blob = new BlobController(q("#story-blob"), { mouth: 0 });
  const face = { m: 0 };
  const setFace = () => blob.setMouth(face.m);

  const heroBlob = q(".hero-blob");
  const cursor = q(".cursor");
  const selection = q(".selection");
  const s1Words = qa(".s1__title .w");
  const s1Rest = [q(".s1__copy"), q(".s1__card"), q(".s1__cta")];
  const s2Words = qa(".s2__title .w");
  const notes = qa(".note");
  const cardMain = q(".card--main");
  const cardsSide = qa(".card--side");
  const s2Extras = [q(".s2__label"), q(".s2__copy")];

  const vw = () => window.innerWidth;
  const vh = () => window.innerHeight;
  const mobile = () => window.matchMedia("(max-width: 820px)").matches;
  const size = () => heroBlob.offsetWidth;

  // Character positions (px from stage centre)
  const start = () => (mobile() ? { x: -vw() * 0.14, y: -vh() * 0.2 } : { x: -vw() * 0.3, y: -vh() * 0.17 });
  const grab = () => (mobile() ? { x: -vw() * 0.05, y: -vh() * 0.12 } : { x: -vw() * 0.2, y: -vh() * 0.1 });
  const centre = () => (mobile() ? { x: 0, y: -vh() * 0.04 } : { x: 0, y: vh() * 0.1 });
  const grip = () => ({ x: size() * 0.3, y: size() * 0.32 });

  const noteRot = [-9, 6, -5, 10];

  // Off-screen by exactly their own size, whatever the layout (desktop / mobile).
  const offLeft = (_i: number, el: HTMLElement) => -(el.offsetLeft + el.offsetWidth + 40);
  const offRight = (_i: number, el: HTMLElement) => vw() - el.offsetLeft + 40;
  gsap.set(selection, { opacity: 0 });
  gsap.set(s2Extras, { opacity: 0, y: 24 });

  // Scene timeline (positions in "story units"); wrapped below in the pinned master.
  const tl = gsap.timeline({ defaults: { ease: "none" } });

  /* ---------------- Scene 1: hero → grab ---------------- */
  tl.addLabel("about", 0)
    .to(s1Words, { yPercent: -70, opacity: 0, filter: "blur(10px)", stagger: 0.035, duration: 0.8, ease: "power1.in" }, 0.15)
    .to(s1Rest, { y: -30, opacity: 0, filter: "blur(8px)", stagger: 0.06, duration: 0.6, ease: "power1.in" }, 0.1)
    .to(heroBlob, { x: () => grab().x, y: () => grab().y, rotation: 0, scale: 0.95, duration: 1.3, ease: "power1.inOut" }, 0.2)
    .to(cursor, { x: () => grab().x + grip().x, y: () => grab().y + grip().y, duration: 1.3, ease: "power2.inOut" }, 0.2)
    .to(face, { m: 2, duration: 0.8, onUpdate: setFace }, 0.6)
    // click!
    .to(cursor, { scale: 0.82, duration: 0.08 }, 1.5)
    .to(selection, { opacity: 1, duration: 0.08 }, 1.52)
    .to(cursor, { scale: 1, duration: 0.1 }, 1.6)
    // drag the character to the centre
    .addLabel("drag", 1.75)
    .to(heroBlob, { x: () => centre().x, y: () => centre().y, scale: 1.05, duration: 0.9, ease: "power2.inOut" }, "drag")
    .to(cursor, { x: () => centre().x + grip().x * 1.05, y: () => centre().y + grip().y * 1.05, duration: 0.9, ease: "power2.inOut" }, "drag")
    .to(face, { m: 4, duration: 0.5, onUpdate: setFace }, "drag+=0.2")
    // drop + flash
    .to(selection, { opacity: 0, duration: 0.1 }, 2.7)
    .to(cursor, { x: () => vw() * 0.6, y: () => vh() * 0.6, opacity: 0, duration: 0.6, ease: "power2.in" }, 2.75)
    .fromTo(".flash", { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: "power2.out" }, 2.7)
    .to(".flash", { opacity: 0, duration: 0.4 }, 3.0)
    .to(face, { m: 1, duration: 0.4, onUpdate: setFace }, 2.9)

    /* ---------------- Scene 2: process notes ---------------- */
    .addLabel("process", 3.1)
    .to(s2Words, { yPercent: 0, opacity: 1, stagger: 0.06, duration: 0.7, ease: "power3.out" }, "process")
    .to(notes, { y: 0, rotation: (i) => noteRot[i], stagger: 0.18, duration: 0.9, ease: "power3.out" }, "process+=0.4")
    .to(face, { m: 2, duration: 0.4, onUpdate: setFace }, "process+=0.6")
    .to({}, { duration: 0.6 })
    .to(notes, {
      y: () => -vh() * 1.1,
      rotation: (i) => -noteRot[i] * 3,
      filter: "blur(6px)",
      stagger: 0.08,
      duration: 0.8,
      ease: "power2.in",
    }, "process+=2.1")

    /* ---------------- Scene 2b: work cards ---------------- */
    .addLabel("work", "process+=2.4")
    .to(cardMain, { x: 0, duration: 1, ease: "power3.out" }, "work")
    .to(cardsSide, { x: 0, stagger: 0.15, duration: 1, ease: "power3.out" }, "work")
    .to(s2Extras, { opacity: 1, y: 0, stagger: 0.1, duration: 0.5 }, "work+=0.4")
    .to(heroBlob, { scale: () => (mobile() ? 0.8 : 0.95), y: () => centre().y + (mobile() ? -vh() * 0.08 : 0), duration: 0.6 }, "work")
    .to(face, { m: 3, duration: 0.4, onUpdate: setFace }, "work+=0.3")
    .to({}, { duration: 1 })

    /* ---------------- Exit ---------------- */
    .addLabel("exit")
    .to(cardMain, { x: () => -vw() * 0.1, y: () => -vh() * 0.6, filter: "blur(8px)", opacity: 0, duration: 0.8, ease: "power2.in" }, "exit")
    .to(cardsSide, { x: () => vw() * 0.1, y: () => -vh() * 0.5, filter: "blur(8px)", opacity: 0, stagger: 0.08, duration: 0.8, ease: "power2.in" }, "exit")
    .to(s2Extras, { opacity: 0, duration: 0.4 }, "exit")
    .to(s2Words, { yPercent: -80, opacity: 0, filter: "blur(8px)", stagger: 0.04, duration: 0.6, ease: "power1.in" }, "exit+=0.2")
    .to(face, { m: 5, duration: 0.4, onUpdate: setFace }, "exit")
    .to(heroBlob, { y: () => -vh() * 0.9, rotation: 18, scale: 0.5, duration: 0.9, ease: "power2.in" }, "exit+=0.35");

  // Master: pinned from the moment the intro iris starts revealing the stage.
  // The first viewport is a hold (the iris), then the scene is scrubbed over 9 viewports.
  const HOLD = tl.duration() / 9;
  const master = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      trigger: "#story",
      start: "top top",
      end: () => "+=" + vh() * 10,
      pin: ".story__stage",
      scrub: 1,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    },
  });
  // Initial states at t=0 of the master — applied as soon as the pin starts and on every refresh
  master
    .set(heroBlob, { x: () => start().x, y: () => start().y, rotation: -10, scale: 0.85 }, 0)
    .set(cursor, { x: () => vw() * 0.36, y: () => vh() * 0.32, scale: 1, opacity: 1 }, 0)
    .set(s2Words, { yPercent: 115, opacity: 0 }, 0)
    .set(notes, { y: () => vh() * 0.9, rotation: (i) => noteRot[i] * 3 }, 0)
    .set(cardMain, { x: offLeft }, 0)
    .set(cardsSide, { x: offRight }, 0)
    .add(tl, HOLD);

  const labelToScroll = (label: string) => {
    const st = master.scrollTrigger!;
    const t = HOLD + (tl.labels[label] ?? 0);
    return st.start + (t / master.duration()) * (st.end - st.start);
  };

  return { blob, labelToScroll };
}
