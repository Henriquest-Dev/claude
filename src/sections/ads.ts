import gsap from "gsap";

/** "Anúncios criados pela HAV Agency" — 5 vertical 9:16 ads in phone frames. */
const ADS = [
  { tag: "Alta retenção", title: "Atração de Tráfego & Conversão Direta", text: "Estruturado com gancho de alto impacto nos primeiros 3 segundos, retenção dinâmica e chamada clara para contacto imediato.", format: "Reels & TikTok Ads" },
  { tag: "Lançamento", title: "Lançamento & Destaque de Oferta", text: "Apresentação visual focada no produto com estética contemporânea, realçando benefícios tangíveis e gerando urgência de compra.", format: "Stories & Feed Sponsor" },
  { tag: "Autoridade", title: "Branding & Autoridade Visual", text: "Peça audiovisual de alto padrão para elevar o valor percebido da marca, consolidando autoridade e memorabilidade imediata.", format: "Motion & Identidade" },
  { tag: "Geolocalizado", title: "Captação para Negócios Locais", text: "Criativo cirúrgico para pequenos negócios e empreendedores conquistarem clientes locais com orçamento controlado e alto retorno.", format: "Anúncio Segmentado" },
  { tag: "Lead flow", title: "Conversão & Fecho de Serviços", text: "Comunicação objetiva dos diferenciais do serviço, eliminando objeções e incentivando mensagens diretas via WhatsApp.", format: "Performance & Leads" },
];

export function initAds(): void {
  const row = document.querySelector<HTMLElement>("[data-ads]")!;
  row.innerHTML = ADS.map((ad, i) => {
    const n = String(i + 1).padStart(2, "0");
    return `
    <article class="ad">
      <div class="phone">
        <div class="phone__screen">
          <div class="phone__top"><span class="phone__avatar">H</span><span><b>hav_.agency</b><small>Patrocinado</small></span></div>
          <button class="phone__mute" type="button" aria-pressed="false" aria-label="Ativar som do anúncio ${n}">🔇 Mudo</button>
          <video data-src="./media/ad-${n}.mp4" poster="./media/ad-${n}.webp" muted loop playsinline preload="none" aria-label="Anúncio ${n}: ${ad.title}"></video>
          <a class="phone__cta" href="#contacto">Quero um anúncio assim <span aria-hidden="true">↗</span></a>
        </div>
      </div>
      <p class="ad__meta">AD ${n} / 05 <span>${ad.tag}</span></p>
      <h3>${ad.title}</h3>
      <p>${ad.text}</p>
      <p class="ad__foot">${ad.format}<a href="#contacto">Contratar ↗</a></p>
    </article>`;
  }).join("");

  // Sound toggle — only one ad can play with sound at a time
  const buttons = [...row.querySelectorAll<HTMLButtonElement>(".phone__mute")];
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const video = btn.parentElement!.querySelector("video")!;
      const turnOn = video.muted;
      buttons.forEach((b) => {
        const v = b.parentElement!.querySelector("video")!;
        v.muted = true;
        b.setAttribute("aria-pressed", "false");
        b.textContent = "🔇 Mudo";
      });
      if (turnOn) {
        if (!video.getAttribute("src")) video.src = video.dataset.src!;
        video.muted = false;
        video.play().catch(() => {});
        btn.setAttribute("aria-pressed", "true");
        btn.textContent = "🔊 Som";
      }
    });
  });

  // Phones rise in with a little tilt
  gsap.from(row.querySelectorAll(".ad"), {
    y: 120,
    rotation: (i) => (i % 2 ? 4 : -4),
    opacity: 0,
    stagger: 0.1,
    duration: 1.1,
    ease: "power3.out",
    scrollTrigger: { trigger: row, start: "top 85%", once: true },
  });
}
