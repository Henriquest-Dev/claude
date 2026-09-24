/**
 * Videos load and play only when they are on screen AND their scene is the
 * one showing (the stage stacks every scene, hidden ones have visibility:hidden).
 */
const onScreen = new Set<HTMLVideoElement>();
let reducedMotion = false;

function visible(v: HTMLVideoElement): boolean {
  const scene = v.closest<HTMLElement>(".scene");
  return !scene || getComputedStyle(scene).visibility !== "hidden";
}

export function syncVideos(): void {
  document.querySelectorAll<HTMLVideoElement>("video[data-src]").forEach((v) => {
    const active = onScreen.has(v) && visible(v);
    if (active) {
      if (!v.getAttribute("src")) {
        v.src = v.dataset.src!;
        v.preload = "auto";
      }
      if (v.paused && (!reducedMotion || v.dataset.userPlay)) v.play().catch(() => {});
    } else if (!v.paused) {
      v.pause();
    }
  });
}

export function initVideos(reduced: boolean): void {
  reducedMotion = reduced;
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        const v = e.target as HTMLVideoElement;
        if (e.isIntersecting) onScreen.add(v);
        else onScreen.delete(v);
      }
      syncVideos();
    },
    { rootMargin: "150px 250px" },
  );
  document.querySelectorAll<HTMLVideoElement>("video[data-src]").forEach((v) => {
    io.observe(v);
    if (reduced) {
      v.style.cursor = "pointer";
      v.addEventListener("click", () => {
        v.dataset.userPlay = "1";
        if (v.paused) v.play().catch(() => {});
        else v.pause();
      });
    }
  });
}
