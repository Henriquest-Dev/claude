import { Springs, FRAMER_SPRING } from "./spring";

/* ------------------------------------------------------------------
   The character: a green blob with big eyes and a mouth that opens
   in 6 steps (the frames from the reference image).
   All geometry lives in a 400×400 viewBox.
   ------------------------------------------------------------------ */

export const BODY_PATH =
  "M40 300C34 262 56 226 68 190C80 154 88 110 120 86C142 70 168 76 190 70C212 64 236 40 266 42C292 44 300 66 303 100C306 132 310 146 328 164C352 188 368 214 366 250C364 300 336 334 280 348C240 358 150 360 100 350C60 342 44 326 40 300Z";

const EYE_L = 143;
const EYE_R = 256;
const EYE_RADIUS = 46;
const PUPIL_RADIUS = 18;
const MOUTH_X = 199;

export interface MouthShape {
  /** mouth width / height / centre y */
  w: number;
  h: number;
  y: number;
  /** eye centre y — the eyes lift when the mouth is wide open */
  eyeY: number;
}

/** The 6 frames: line → small oval → "o" → bigger → bigger → huge. */
export const MOUTHS: MouthShape[] = [
  { w: 42, h: 13, y: 268, eyeY: 196 },
  { w: 34, h: 28, y: 268, eyeY: 196 },
  { w: 57, h: 57, y: 275, eyeY: 194 },
  { w: 82, h: 82, y: 272, eyeY: 188 },
  { w: 105, h: 105, y: 274, eyeY: 180 },
  { w: 144, h: 144, y: 276, eyeY: 158 },
];

export const MOUTH_CENTER = { x: MOUTH_X, y: MOUTHS[MOUTHS.length - 1].y };

/** Interpolated mouth for a fractional frame index (0 … 5). */
export function mouthAt(f: number): MouthShape {
  const max = MOUTHS.length - 1;
  const c = Math.max(0, Math.min(max, f));
  const i = Math.min(max - 1, Math.floor(c));
  const t = c - i;
  const a = MOUTHS[i];
  const b = MOUTHS[i + 1];
  const lerp = (x: number, y: number) => x + (y - x) * t;
  return { w: lerp(a.w, b.w), h: lerp(a.h, b.h), y: lerp(a.y, b.y), eyeY: lerp(a.eyeY, b.eyeY) };
}

/** Static SVG markup (used for the favicon-style logo, the crowd and thumbnails). */
export function blobMarkup(
  opts: { mouth?: number; className?: string; look?: [number, number]; label?: string } = {},
): string {
  const m = mouthAt(opts.mouth ?? 0);
  const [lx, ly] = opts.look ?? [0, 0];
  const aria = opts.label ? `role="img" aria-label="${opts.label}"` : `aria-hidden="true"`;
  const eye = (cx: number, inward: number) =>
    `<g class="blob-eye" transform="translate(${cx} ${m.eyeY})">` +
    `<circle r="${EYE_RADIUS}" fill="#fff"/>` +
    `<circle class="blob-pupil" data-in="${inward}" cx="${inward + lx * 14}" cy="${ly * 12}" r="${PUPIL_RADIUS}" fill="var(--ink)"/>` +
    `</g>`;
  return (
    `<svg class="blob ${opts.className ?? ""}" viewBox="0 0 400 400" ${aria} focusable="false">` +
    `<g class="blob-rig">` +
    `<path class="blob-body" d="${BODY_PATH}" fill="var(--green)" stroke="var(--ink)" stroke-width="9" stroke-linejoin="round"/>` +
    eye(EYE_L, 7) +
    eye(EYE_R, -7) +
    `<rect class="blob-mouth" x="${MOUTH_X - m.w / 2}" y="${m.y - m.h / 2}" width="${m.w}" height="${m.h}" rx="${Math.min(m.w, m.h) / 2}" fill="var(--ink)"/>` +
    `</g></svg>`
  );
}

/* ------------------------------------------------------------------
   Animated controller (spring-driven, like Framer variants)
   ------------------------------------------------------------------ */

type Key = "s" | "tx" | "ty" | "fx" | "fy" | "mw" | "mh" | "my" | "ey" | "lx" | "ly" | "blink";

const controllers = new Set<BlobController>();

export class BlobController {
  readonly svg: SVGSVGElement;
  readonly springs: Springs<Key>;
  private rig: SVGGElement;
  private eyes: SVGGElement[];
  private pupils: SVGCircleElement[];
  private mouth: SVGRectElement;
  private dirty = true;
  private blinkTimer = 0;
  private nextBlink = 2 + Math.random() * 3;

  constructor(host: HTMLElement, opts: { mouth?: number; scale?: number; instant?: boolean; blink?: boolean } = {}) {
    host.innerHTML = blobMarkup({ mouth: opts.mouth ?? 0 });
    this.svg = host.querySelector("svg")!;
    this.rig = this.svg.querySelector(".blob-rig")!;
    this.eyes = [...this.svg.querySelectorAll<SVGGElement>(".blob-eye")];
    this.pupils = [...this.svg.querySelectorAll<SVGCircleElement>(".blob-pupil")];
    this.mouth = this.svg.querySelector(".blob-mouth")!;

    const m = mouthAt(opts.mouth ?? 0);
    this.springs = new Springs<Key>(
      { s: opts.scale ?? 1, tx: 0, ty: 0, fx: 200, fy: 200, mw: m.w, mh: m.h, my: m.y, ey: m.eyeY, lx: 0, ly: 0, blink: 1 },
      FRAMER_SPRING,
      opts.instant ?? false,
    );
    if (opts.blink === false) this.nextBlink = Infinity;
    controllers.add(this);
  }

  setMouth(frame: number): void {
    const m = mouthAt(frame);
    this.springs.set({ mw: m.w, mh: m.h, my: m.y, ey: m.eyeY });
    this.dirty = true;
  }

  /** Scale around a focus point, then offset (viewBox units). */
  setRig(r: { s?: number; tx?: number; ty?: number; fx?: number; fy?: number }): void {
    this.springs.set(r);
    this.dirty = true;
  }

  /** Where the pupils look: -1 … 1 on each axis. */
  setLook(x: number, y: number): void {
    this.springs.set({ lx: x, ly: y });
    this.dirty = true;
  }

  blink(): void {
    this.springs.jump({ blink: 0.08 });
    this.dirty = true;
  }

  destroy(): void {
    controllers.delete(this);
  }

  update(dt: number): void {
    this.blinkTimer += dt;
    if (this.blinkTimer > this.nextBlink) {
      this.blinkTimer = 0;
      this.nextBlink = 2.5 + Math.random() * 3.5;
      this.blink();
    }
    if (!this.dirty) return;
    this.dirty = this.springs.step(dt);
    this.render();
  }

  private render(): void {
    const g = (k: Key) => this.springs.get(k);
    this.rig.setAttribute(
      "transform",
      `translate(${200 + g("tx")} ${200 + g("ty")}) scale(${g("s")}) translate(${-g("fx")} ${-g("fy")})`,
    );
    const w = Math.max(0, g("mw"));
    const h = Math.max(0, g("mh"));
    const my = g("my");
    this.mouth.setAttribute("x", String(MOUTH_X - w / 2));
    this.mouth.setAttribute("y", String(my - h / 2));
    this.mouth.setAttribute("width", String(w));
    this.mouth.setAttribute("height", String(h));
    this.mouth.setAttribute("rx", String(Math.min(w, h) / 2));

    const ey = g("ey");
    const blink = Math.max(0.05, Math.min(1.2, g("blink")));
    this.eyes[0].setAttribute("transform", `translate(${EYE_L} ${ey}) scale(1 ${blink})`);
    this.eyes[1].setAttribute("transform", `translate(${EYE_R} ${ey}) scale(1 ${blink})`);
    const lx = g("lx");
    const ly = g("ly");
    this.pupils.forEach((p) => {
      const inward = Number(p.dataset.in);
      p.setAttribute("cx", String(inward + lx * 14));
      p.setAttribute("cy", String(ly * 12));
    });
  }
}

/** Drive every controller from one ticker (hooked to gsap.ticker in main.ts). */
export function tickBlobs(dt: number): void {
  controllers.forEach((c) => c.update(dt));
}

/* ------------------------------------------------------------------
   Pupils of *static* blobs (crowd, thumbnails) follow the pointer too
   ------------------------------------------------------------------ */
export function followPointer(root: ParentNode, onLook?: (x: number, y: number) => void): void {
  let raf = 0;
  let px = 0;
  let py = 0;
  window.addEventListener(
    "pointermove",
    (e) => {
      px = (e.clientX / window.innerWidth - 0.5) * 2;
      py = (e.clientY / window.innerHeight - 0.5) * 2;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        onLook?.(px, py);
        root.querySelectorAll<SVGCircleElement>(".blob--static .blob-pupil").forEach((p) => {
          const inward = Number(p.dataset.in);
          p.setAttribute("cx", String(inward + px * 14));
          p.setAttribute("cy", String(py * 12));
        });
      });
    },
    { passive: true },
  );
}
