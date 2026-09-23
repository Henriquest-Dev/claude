import gsap from "gsap";
import { blobMarkup } from "../lib/blob";

/** Contact: headline reveal + a crowd of characters rising from the bottom. */
export function initContact(): void {
  const words = document.querySelectorAll(".contact__title .w");
  const rest = document.querySelectorAll(".contact .eyebrow, .contact__copy, .contact__grid, .footer");

  gsap
    .timeline({
      scrollTrigger: { trigger: "#contacto", start: "top 65%", toggleActions: "play none none reverse" },
    })
    .from(words, { yPercent: 110, opacity: 0, filter: "blur(10px)", stagger: 0.05, duration: 1, ease: "power3.out" })
    .from(rest, { y: 30, opacity: 0, stagger: 0.12, duration: 0.8, ease: "power3.out" }, "-=0.6");

  initForm();

  // Build the crowd
  const crowd = document.querySelector<HTMLElement>(".crowd")!;
  const count = window.innerWidth < 700 ? 7 : 13;
  const rand = (a: number, b: number) => a + Math.random() * (b - a);
  const items: HTMLElement[] = [];

  for (let i = 0; i < count; i++) {
    const el = document.createElement("span");
    el.className = "crowd__item";
    const size = rand(0.62, 1) * 100; // % of crowd height
    el.style.width = el.style.height = `calc(var(--crowd-h) * ${size / 100})`;
    el.style.left = `calc(${(i / (count - 1)) * 100}% - var(--crowd-h) * ${size / 200} + ${rand(-2, 2)}%)`;
    el.style.zIndex = String(Math.round(rand(1, 10)));
    el.innerHTML = blobMarkup({ mouth: Math.floor(rand(0, 6)), className: "blob--static" });
    crowd.appendChild(el);
    items.push(el);
  }

  gsap.fromTo(
    items,
    { yPercent: 120, rotation: () => rand(-25, 25) },
    {
      yPercent: 0,
      rotation: () => rand(-10, 10),
      ease: "back.out(1.7)",
      stagger: { each: 0.05, from: "center" },
      scrollTrigger: { trigger: "#contacto", start: "top 35%", end: "bottom bottom", scrub: 1 },
    },
  );

  // idle bobbing on the inner svg so it doesn't fight the scroll tween
  items.forEach((el) => {
    gsap.to(el.firstElementChild, {
      y: rand(-10, -4),
      duration: rand(1.2, 2),
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: rand(0, 1.5),
    });
  });
}

/** No backend needed: the form opens WhatsApp (or the mail app) with the message ready. */
function initForm(): void {
  const form = document.querySelector<HTMLFormElement>("[data-contact-form]");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const via = (e.submitter as HTMLElement | null)?.dataset.via ?? "whatsapp";
    const d = new FormData(form);
    const get = (k: string) => String(d.get(k) ?? "").trim();
    const text = [
      "Olá HAV Agency! 👋",
      `Nome/Empresa: ${get("nome")}`,
      `Email: ${get("email")}`,
      get("telefone") ? `Telefone: ${get("telefone")}` : "",
      `Serviço: ${get("servico")}`,
      "",
      get("mensagem"),
    ]
      .filter((line, i) => line !== "" || i === 5)
      .join("\n");
    const url =
      via === "email"
        ? `mailto:${form.dataset.email}?subject=${encodeURIComponent(`Novo projeto — ${get("servico")}`)}&body=${encodeURIComponent(text)}`
        : `https://wa.me/${form.dataset.whatsapp}?text=${encodeURIComponent(text)}`;
    window.open(url, via === "email" ? "_self" : "_blank", "noopener");
  });
}
