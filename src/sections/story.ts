import gsap from "gsap";
import { BlobController } from "../lib/blob";
import { syncVideos } from "../lib/media";

/**
 * The whole site after the intro is ONE pinned stage, scrubbed by the scroll
 * (the dynamic of the reference video): scenes enter and leave on the same
 * green background, and the slime walks the visitor through all of them.
 *
 * hero → grab → process notes → services → website showcase → apps → ads →
 * projects → about → contact (+ the crowd of slimes).
 */
export function initStory(): { blob: BlobController; scrollTo: (label: string) => number } {
  const q = <T extends Element = HTMLElement>(s: string, root: ParentNode = document) => root.querySelector<T>(s)!;
  const qa = <T extends Element = HTMLElement>(s: string, root: ParentNode = document) => [...root.querySelectorAll<T>(s)];

  const blob = new BlobController(q("#story-blob"), { mouth: 0 });
  const face = { m: 0 };
  const setFace = () => blob.setMouth(face.m);

  const vw = () => window.innerWidth;
  const vh = () => window.innerHeight;
  const mobile = () => window.matchMedia("(max-width: 900px)").matches;

  /* ---------------- elements ---------------- */
  const heroBlob = q(".hero-blob");
  const cursor = q(".cursor");
  const selection = q(".selection");
  const s1Words = qa(".s1__title .w");
  const s1Rest = [q(".s1__eyebrow"), q(".s1__copy"), q(".s1__card"), q(".s1__cta")];
  const s2Words = qa(".s2__title .w");
  const notes = qa(".note");

  const svc = q(".sc-svc");
  const demo = q(".sc-demo");
  const apps = q(".sc-apps");
  const ads = q(".sc-ads");
  const proj = q(".sc-proj");
  const about = q(".sc-about");
  const contact = q(".sc-contact");
  const scenes = [svc, demo, apps, ads, proj, about, contact];

  const head = (scene: HTMLElement) => ({ eyebrow: q(".eyebrow", scene), words: qa(".sc-title .w", scene) });
  const svcItems = qa(".svc-item", svc);
  const svcCount = q("[data-svc-index]", svc);
  const demoTrack = q(".demo-track", demo);
  const demoCount = q("[data-demo-index]", demo);
  const slides = qa(".app-slide", apps);
  const adsTrack = q(".ads-track", ads);
  const phones = qa(".ad", ads);
  const rows = qa(".project", proj);
  const aboutP = q(".sc-about__p", about);
  const stats = qa(".stats li", about);
  const counters = qa<HTMLElement>("[data-count]", about);
  const contactBody = q(".sc-contact__body", contact);
  const footer = q(".footer", contact);
  const crowd = qa(".crowd__item");

  /* ---------------- slime positions (px from stage centre) ---------------- */
  const size = () => heroBlob.offsetWidth;
  const P = {
    start: () => (mobile() ? { x: -vw() * 0.14, y: -vh() * 0.2 } : { x: -vw() * 0.3, y: -vh() * 0.17 }),
    grab: () => (mobile() ? { x: -vw() * 0.05, y: -vh() * 0.12 } : { x: -vw() * 0.2, y: -vh() * 0.1 }),
    centre: () => (mobile() ? { x: 0, y: -vh() * 0.04 } : { x: 0, y: vh() * 0.1 }),
    side: () => (mobile() ? { x: vw() * 0.3, y: -vh() * 0.12 } : { x: vw() * 0.3, y: vh() * 0.02 }),
    away: () => ({ x: vw() * 0.3, y: vh() * 0.8 }),
  };
  const grip = () => ({ x: size() * 0.3, y: size() * 0.32 });
  const noteRot = [-9, 6, -5, 10];

  /* ---------------- tween helpers ---------------- */
  const tl = gsap.timeline({ defaults: { ease: "none" } });
  const HIDE_WORDS = { yPercent: 110, opacity: 0, filter: "blur(10px)" };
  const wordsIn = (w: Element[], at: gsap.Position) =>
    tl.to(w, { yPercent: 0, opacity: 1, filter: "blur(0px)", stagger: 0.05, duration: 0.7, ease: "power3.out" }, at);
  const wordsOut = (w: Element[], at: gsap.Position) =>
    tl.to(w, { yPercent: -80, opacity: 0, filter: "blur(8px)", stagger: 0.03, duration: 0.5, ease: "power1.in" }, at);
  const fadeIn = (t: gsap.TweenTarget, at: gsap.Position, extra: gsap.TweenVars = {}) =>
    tl.to(t, { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.6, ease: "power3.out", ...extra }, at);
  const fadeOut = (t: gsap.TweenTarget, at: gsap.Position, extra: gsap.TweenVars = {}) =>
    tl.to(t, { y: -40, opacity: 0, filter: "blur(8px)", duration: 0.5, ease: "power1.in", ...extra }, at);
  const moveBlob = (to: () => { x: number; y: number }, at: gsap.Position, vars: gsap.TweenVars = {}) =>
    tl.to(heroBlob, { x: () => to().x, y: () => to().y, duration: 0.9, ease: "power2.inOut", ...vars }, at);
  const faceTo = (m: number, at: gsap.Position) => tl.to(face, { m, duration: 0.35, onUpdate: setFace }, at);
  const show = (scene: HTMLElement, at: gsap.Position) => tl.set(scene, { autoAlpha: 1 }, at);
  const hide = (scene: HTMLElement, at: gsap.Position) => tl.set(scene, { autoAlpha: 0 }, at);

  /* ================= hero → grab ================= */
  tl.addLabel("hero", 0)
    .to(s1Words, { yPercent: -70, opacity: 0, filter: "blur(10px)", stagger: 0.035, duration: 0.8, ease: "power1.in" }, 0.15)
    .to(s1Rest, { y: -30, opacity: 0, filter: "blur(8px)", stagger: 0.06, duration: 0.6, ease: "power1.in" }, 0.1)
    .to(heroBlob, { x: () => P.grab().x, y: () => P.grab().y, rotation: 0, scale: 0.95, duration: 1.3, ease: "power1.inOut" }, 0.2)
    .to(cursor, { x: () => P.grab().x + grip().x, y: () => P.grab().y + grip().y, duration: 1.3, ease: "power2.inOut" }, 0.2);
  faceTo(2, 0.6);
  tl.to(cursor, { scale: 0.82, duration: 0.08 }, 1.5)
    .to(selection, { opacity: 1, duration: 0.08 }, 1.52)
    .to(cursor, { scale: 1, duration: 0.1 }, 1.6)
    .to(heroBlob, { x: () => P.centre().x, y: () => P.centre().y, scale: 1.05, duration: 0.9, ease: "power2.inOut" }, 1.75)
    .to(cursor, { x: () => P.centre().x + grip().x * 1.05, y: () => P.centre().y + grip().y * 1.05, duration: 0.9, ease: "power2.inOut" }, 1.75);
  faceTo(4, 1.95);
  tl.to(selection, { opacity: 0, duration: 0.1 }, 2.7)
    .to(cursor, { x: () => vw() * 0.6, y: () => vh() * 0.6, opacity: 0, duration: 0.6, ease: "power2.in" }, 2.75)
    .fromTo(".flash", { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: "power2.out" }, 2.7)
    .to(".flash", { opacity: 0, duration: 0.4 }, 3.0);
  faceTo(1, 2.9);

  /* ================= process notes ================= */
  tl.addLabel("process", 3.1);
  wordsIn(s2Words, "process");
  tl.to(notes, { y: 0, rotation: (i) => noteRot[i], stagger: 0.18, duration: 0.9, ease: "power3.out" }, "process+=0.4");
  faceTo(2, "process+=0.6");
  tl.to(notes, { y: () => -vh() * 1.1, rotation: (i) => -noteRot[i] * 3, filter: "blur(6px)", stagger: 0.08, duration: 0.8, ease: "power2.in" }, "process+=2");
  wordsOut(s2Words, "process+=2.3");

  /* ================= services — one big service at a time ================= */
  tl.addLabel("services", "process+=2.7");
  show(svc, "services");
  const svcHead = head(svc);
  fadeIn(svcHead.eyebrow, "services");
  wordsIn(svcHead.words, "services+=0.1");
  fadeIn(q(".sc-count", svc), "services+=0.3");
  moveBlob(P.side, "services", { rotation: 0, scale: () => (mobile() ? 0.45 : 0.8) });
  const svcCounter = { v: 1 };
  svcItems.forEach((item, i) => {
    const t = 0.7 + i * 1.2;
    fadeIn(item, `services+=${t}`, { duration: 0.55 });
    faceTo(i, `services+=${t}`);
    tl.to(svcCounter, { v: i + 1, duration: 0.3, onUpdate: () => (svcCount.textContent = String(Math.round(svcCounter.v)).padStart(2, "0")) }, `services+=${t}`);
    if (i < svcItems.length - 1) fadeOut(item, `services+=${t + 0.85}`, { duration: 0.4 });
  });
  const svcEnd = 0.7 + svcItems.length * 1.2;
  fadeOut([svcItems[svcItems.length - 1], q(".sc-count", svc), svcHead.eyebrow], `services+=${svcEnd}`);
  wordsOut(svcHead.words, `services+=${svcEnd}`);
  moveBlob(P.away, `services+=${svcEnd}`, { scale: 0.5 });
  hide(svc, `services+=${svcEnd + 0.7}`);

  /* ================= website showcase — the track slides across ================= */
  tl.addLabel("demo", `services+=${svcEnd + 0.6}`);
  show(demo, "demo");
  const demoHead = head(demo);
  fadeIn(demoHead.eyebrow, "demo");
  wordsIn(demoHead.words, "demo+=0.1");
  fadeIn(q(".sc-count", demo), "demo+=0.3");
  tl.fromTo(
    demoTrack,
    { x: () => vw() },
    {
      x: () => -demoTrack.scrollWidth,
      duration: 6,
      onUpdate() {
        const p = this.progress();
        const n = demoTrack.children.length;
        demoCount.textContent = String(Math.min(n, Math.max(1, Math.round(p * (n + 1))))).padStart(2, "0");
      },
    },
    "demo+=0.2",
  );
  fadeOut([demoHead.eyebrow, q(".sc-count", demo)], "demo+=5.8");
  wordsOut(demoHead.words, "demo+=5.8");
  hide(demo, "demo+=6.4");

  /* ================= apps — slides replace each other ================= */
  tl.addLabel("apps", "demo+=6.2");
  show(apps, "apps");
  const appsHead = head(apps);
  fadeIn(appsHead.eyebrow, "apps");
  wordsIn(appsHead.words, "apps+=0.1");
  slides.forEach((slide, i) => {
    const t = 0.4 + i * 1.3;
    tl.to(slide, { x: 0, opacity: 1, filter: "blur(0px)", duration: 0.7, ease: "power3.out" }, `apps+=${t}`);
    if (i < slides.length - 1)
      tl.to(slide, { x: () => -vw() * 0.8, opacity: 0, filter: "blur(8px)", duration: 0.6, ease: "power2.in" }, `apps+=${t + 1.0}`);
  });
  const appsEnd = 0.4 + slides.length * 1.3;
  fadeOut([slides[slides.length - 1], appsHead.eyebrow], `apps+=${appsEnd}`);
  wordsOut(appsHead.words, `apps+=${appsEnd}`);
  hide(apps, `apps+=${appsEnd + 0.6}`);

  /* ================= ads — phones rise ================= */
  tl.addLabel("ads", `apps+=${appsEnd + 0.5}`);
  show(ads, "ads");
  const adsHead = head(ads);
  fadeIn(adsHead.eyebrow, "ads");
  wordsIn(adsHead.words, "ads+=0.1");
  tl.to(phones, { y: 0, rotation: 0, opacity: 1, stagger: 0.12, duration: 0.9, ease: "power3.out" }, "ads+=0.3");
  // on narrow screens the row is wider than the stage — slide it
  tl.to(adsTrack, { x: () => -Math.max(0, adsTrack.scrollWidth - (vw() - 2 * parseFloat(getComputedStyle(ads).paddingLeft))), duration: 1.8 }, "ads+=1.2");
  tl.to(phones, { y: () => -vh(), opacity: 0, filter: "blur(8px)", stagger: 0.06, duration: 0.8, ease: "power2.in" }, "ads+=3.2");
  fadeOut(adsHead.eyebrow, "ads+=3.3");
  wordsOut(adsHead.words, "ads+=3.3");
  hide(ads, "ads+=4.1");

  /* ================= projects — a list that writes itself ================= */
  tl.addLabel("projects", "ads+=3.9");
  show(proj, "projects");
  const projHead = head(proj);
  fadeIn(projHead.eyebrow, "projects");
  wordsIn(projHead.words, "projects+=0.1");
  fadeIn(rows, "projects+=0.4", { stagger: 0.12 });
  fadeOut(rows, "projects+=2.4", { stagger: 0.05 });
  fadeOut(projHead.eyebrow, "projects+=2.5");
  wordsOut(projHead.words, "projects+=2.5");
  hide(proj, "projects+=3.2");

  /* ================= about — the slime comes back ================= */
  tl.addLabel("about", "projects+=3");
  show(about, "about");
  const aboutHead = head(about);
  fadeIn(aboutHead.eyebrow, "about");
  wordsIn(aboutHead.words, "about+=0.1");
  fadeIn(aboutP, "about+=0.5");
  fadeIn(stats, "about+=0.7", { stagger: 0.12 });
  moveBlob(() => (mobile() ? P.away() : P.side()), "about+=0.2", { scale: () => (mobile() ? 0.45 : 0.8), rotation: -8 });
  faceTo(1, "about+=0.4");
  counters.forEach((el) => {
    const n = { v: 0 };
    const target = Number(el.dataset.count);
    const prefix = el.dataset.prefix ?? "";
    tl.to(n, { v: target, duration: 1, ease: "power2.out", onUpdate: () => (el.textContent = prefix + Math.round(n.v)) }, "about+=0.7");
  });
  fadeOut([aboutP, ...stats, aboutHead.eyebrow], "about+=2.6", { stagger: 0.04 });
  wordsOut(aboutHead.words, "about+=2.6");
  hide(about, "about+=3.3");

  /* ================= contact — the crowd rises ================= */
  tl.addLabel("contact", "about+=3.1");
  show(contact, "contact");
  const contactHead = head(contact);
  fadeIn(contactHead.eyebrow, "contact");
  wordsIn(contactHead.words, "contact+=0.1");
  fadeIn([contactBody, footer], "contact+=0.5", { stagger: 0.12 });
  moveBlob(() => ({ x: 0, y: vh() * 0.75 }), "contact", { scale: 0.6, rotation: 0 });
  faceTo(5, "contact+=0.4");
  tl.to(crowd, { yPercent: 0, rotation: () => gsap.utils.random(-10, 10), stagger: { each: 0.06, from: "center" }, duration: 1, ease: "back.out(1.7)" }, "contact+=0.6");
  tl.addLabel("end", "contact+=1.8").to({}, { duration: 0.2 }, "end");

  /* ================= master: pinned, scrubbed ================= */
  const K = 0.8; // viewports of scroll per timeline unit
  const HOLD = 1 / K; // first viewport = the intro iris opening over the stage
  const offLeftRight = (i: number) => (i % 2 ? 1 : -1);

  const master = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      trigger: "#story",
      start: "top top",
      end: () => "+=" + vh() * K * master.duration(),
      pin: ".story__stage",
      scrub: 1,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: syncVideos,
    },
  });

  // Initial state of every scene at t = 0 (re-applied on every refresh)
  master
    .set(heroBlob, { x: () => P.start().x, y: () => P.start().y, rotation: -10, scale: 0.85 }, 0)
    .set(cursor, { x: () => vw() * 0.36, y: () => vh() * 0.32, scale: 1, opacity: 1 }, 0)
    .set(selection, { opacity: 0 }, 0)
    .set(s2Words, HIDE_WORDS, 0)
    .set(notes, { y: () => vh() * 0.9, rotation: (i) => noteRot[i] * 3 }, 0)
    .set(scenes, { autoAlpha: 0 }, 0)
    .set(scenes.flatMap((s) => qa(".sc-title .w", s)), HIDE_WORDS, 0)
    .set(scenes.map((s) => q(".eyebrow", s)), { opacity: 0, y: 20 }, 0)
    .set([...svcItems, ...qa(".sc-count"), ...rows, aboutP, ...stats, contactBody, footer], { opacity: 0, y: 50, filter: "blur(8px)" }, 0)
    .set(slides, { x: () => vw() * 0.8, opacity: 0, filter: "blur(8px)" }, 0)
    .set(phones, { y: () => vh() * 0.8, rotation: (i) => offLeftRight(i) * 6, opacity: 0 }, 0)
    .set(adsTrack, { x: 0 }, 0)
    .set(crowd, { yPercent: 130 }, 0)
    .add(tl, HOLD);

  /** Scroll position of a scene, slightly inside it so its title is already in. */
  const scrollTo = (label: string) => {
    const st = master.scrollTrigger!;
    if (label === "contact") return st.end;
    const t = HOLD + (tl.labels[label] ?? 0) + (label === "hero" ? 0 : 0.9);
    return st.start + (t / master.duration()) * (st.end - st.start);
  };

  return { blob, scrollTo };
}
