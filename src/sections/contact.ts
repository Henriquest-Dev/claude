import type Lenis from "lenis";
import { blobMarkup } from "../lib/blob";
import { tr } from "../i18n";

/** Builds the crowd of slimes for the last scene (it rises with the stage timeline). */
export function buildCrowd(): void {
  const crowd = document.querySelector<HTMLElement>(".crowd")!;
  const count = window.innerWidth < 700 ? 7 : 13;
  const rand = (a: number, b: number) => a + Math.random() * (b - a);
  for (let i = 0; i < count; i++) {
    const el = document.createElement("span");
    el.className = "crowd__item";
    const size = rand(0.62, 1);
    el.style.width = el.style.height = `calc(var(--crowd-h) * ${size})`;
    el.style.left = `calc(${(i / (count - 1)) * 100}% - var(--crowd-h) * ${size / 2} + ${rand(-2, 2)}%)`;
    el.style.zIndex = String(Math.round(rand(1, 10)));
    el.innerHTML = blobMarkup({ mouth: Math.floor(rand(0, 6)), className: "blob--static" });
    crowd.appendChild(el);
  }
}

/** Contact form in a dialog. No backend: it opens WhatsApp or the mail app with the message ready. */
export function initForm(lenis: Lenis | null): void {
  const modal = document.getElementById("contact-modal") as HTMLDialogElement;
  const form = modal.querySelector<HTMLFormElement>("[data-contact-form]")!;

  document.querySelectorAll("[data-open-form]").forEach((b) =>
    b.addEventListener("click", () => {
      lenis?.stop();
      modal.showModal();
    }),
  );
  modal.querySelector("[data-close]")!.addEventListener("click", () => modal.close());
  modal.addEventListener("click", (e) => e.target === modal && modal.close());
  modal.addEventListener("close", () => lenis?.start());

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const via = (e.submitter as HTMLElement | null)?.dataset.via ?? "whatsapp";
    const d = new FormData(form);
    const get = (k: string) => String(d.get(k) ?? "").trim();
    const text = [
      tr("Olá HAV Agency! 👋", "Hi HAV Agency! 👋"),
      `${tr("Nome/Empresa", "Name/Company")}: ${get("nome")}`,
      `Email: ${get("email")}`,
      get("telefone") ? `${tr("Telefone", "Phone")}: ${get("telefone")}` : "",
      `${tr("Serviço", "Service")}: ${get("servico")}`,
      "",
      get("mensagem"),
    ]
      .filter((line, i) => line !== "" || i === 5)
      .join("\n");
    const url =
      via === "email"
        ? `mailto:${form.dataset.email}?subject=${encodeURIComponent(`${tr("Novo projeto", "New project")} — ${get("servico")}`)}&body=${encodeURIComponent(text)}`
        : `https://wa.me/${form.dataset.whatsapp}?text=${encodeURIComponent(text)}`;
    window.open(url, via === "email" ? "_self" : "_blank", "noopener");
  });
}
