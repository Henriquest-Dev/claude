import { tr } from "../i18n";

/** Builds the 5 vertical 9:16 ads (animated by the stage timeline), with a sound toggle. */
const ADS = tr(
  [
    { tag: "Alta retenção", title: "Atração de tráfego & conversão direta" },
    { tag: "Lançamento", title: "Lançamento & destaque de oferta" },
    { tag: "Autoridade", title: "Branding & autoridade visual" },
    { tag: "Geolocalizado", title: "Captação para negócios locais" },
    { tag: "Lead flow", title: "Conversão & fecho de serviços" },
  ],
  [
    { tag: "High retention", title: "Traffic & direct conversion" },
    { tag: "Launch", title: "Launch & offer spotlight" },
    { tag: "Authority", title: "Branding & visual authority" },
    { tag: "Geo-targeted", title: "Local business lead generation" },
    { tag: "Lead flow", title: "Conversion & closing" },
  ],
);

const SOUND_ON = tr("Som ligado", "Sound on");
const SOUND_OFF = tr("Ligar som", "Sound off");

export function buildAds(): void {
  const row = document.querySelector<HTMLElement>("[data-ads]")!;
  row.innerHTML = ADS.map((ad, i) => {
    const n = String(i + 1).padStart(2, "0");
    return `
    <article class="ad">
      <div class="phone">
        <video data-src="./media/ad-${n}.mp4" poster="./media/ad-${n}.webp" muted loop playsinline preload="none" aria-label="${ad.title}"></video>
        <button class="phone__mute" type="button" aria-pressed="false">${SOUND_OFF}</button>
      </div>
      <p class="ad__meta">${n} · ${ad.tag}</p>
      <h3>${ad.title}</h3>
    </article>`;
  }).join("");

  // Only one ad can play with sound at a time
  const buttons = [...row.querySelectorAll<HTMLButtonElement>(".phone__mute")];
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const video = btn.parentElement!.querySelector("video")!;
      const turnOn = video.muted;
      buttons.forEach((b) => {
        b.parentElement!.querySelector("video")!.muted = true;
        b.setAttribute("aria-pressed", "false");
        b.textContent = SOUND_OFF;
      });
      if (turnOn) {
        if (!video.getAttribute("src")) video.src = video.dataset.src!;
        video.muted = false;
        video.play().catch(() => {});
        btn.setAttribute("aria-pressed", "true");
        btn.textContent = SOUND_ON;
      }
    });
  });

}
