/**
 * Lazy videos: nothing is downloaded until a video gets close to the viewport,
 * and videos pause again as soon as they leave it (saves data + battery).
 */
export function initVideos(reduced: boolean): void {
  const videos = document.querySelectorAll<HTMLVideoElement>("video[data-src]");
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        const v = e.target as HTMLVideoElement;
        if (e.isIntersecting) {
          if (!v.getAttribute("src")) {
            v.src = v.dataset.src!;
            v.preload = "auto";
          }
          if (!reduced || v.dataset.userPlay) v.play().catch(() => {});
        } else if (!v.paused) {
          v.pause();
        }
      }
    },
    { rootMargin: "250px 250px" },
  );
  videos.forEach((v) => {
    io.observe(v);
    // With reduced motion nothing autoplays — a click toggles playback instead
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
