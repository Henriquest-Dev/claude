import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { tr } from "../i18n";

gsap.registerPlugin(Flip);

/** Selected work — a clean editorial list with animated filters (GSAP Flip). */
const PROJECTS = tr(
  [
    { cat: "websites", label: "Website", title: "Lumina Studio & Arquitetura", text: "Website institucional editorial com tipografia minimalista e portfólio de alta fidelidade." },
    { cat: "aplicativos", label: "Aplicativo", title: "Pulse Flow Operações", text: "Aplicação web para monitorização de inventário e despachos logísticos, em tablet e desktop." },
    { cat: "publicidade", label: "Publicidade", title: "Campanha Café de Origem", text: "Criativos estáticos e animados de baixo custo para atrair clientes locais nas redes sociais." },
    { cat: "marketing", label: "Marketing", title: "Nordic Essence Mobiliário", text: "Presença digital, posicionamento visual e comunicação para uma marca de design sustentável." },
    { cat: "websites", label: "Website", title: "Clínica Integrativa Vita", text: "Portal de saúde com sistema visual calmo, agendamento facilitado e informação clara." },
    { cat: "aplicativos", label: "Aplicativo", title: "Rota Segura Gestão de Frota", text: "Painel interativo com telemetria simplificada e rotas para pequenas distribuidoras." },
  ],
  [
    { cat: "websites", label: "Website", title: "Lumina Studio & Architecture", text: "Editorial corporate website with minimalist typography and a high-fidelity portfolio." },
    { cat: "aplicativos", label: "App", title: "Pulse Flow Operations", text: "Web app for inventory tracking and logistics dispatch, on tablet and desktop." },
    { cat: "publicidade", label: "Advertising", title: "Café de Origem Campaign", text: "Low-cost static and animated creatives to attract local customers on social media." },
    { cat: "marketing", label: "Marketing", title: "Nordic Essence Furniture", text: "Digital presence, visual positioning and communication for a sustainable design brand." },
    { cat: "websites", label: "Website", title: "Vita Integrative Clinic", text: "Healthcare portal with a calm visual system, easy booking and clear information." },
    { cat: "aplicativos", label: "App", title: "Rota Segura Fleet Manager", text: "Interactive dashboard with simple telemetry and routes for small distributors." },
  ],
);

export function initProjects(): void {
  const list = document.querySelector<HTMLElement>("[data-projects]")!;
  list.innerHTML = PROJECTS.map(
    (p, i) => `
    <li class="project" data-cat="${p.cat}" data-reveal>
      <a href="#contacto">
        <span class="project__num">${String(i + 1).padStart(2, "0")}</span>
        <span class="project__title">${p.title}</span>
        <span class="project__text">${p.text}</span>
        <span class="project__cat">${p.label}</span>
        <span class="project__arrow" aria-hidden="true">↗</span>
      </a>
    </li>`,
  ).join("");

  const items = [...list.querySelectorAll<HTMLElement>(".project")];
  const buttons = [...document.querySelectorAll<HTMLButtonElement>("[data-filter]")];

  buttons.forEach((btn) =>
    btn.addEventListener("click", () => {
      const f = btn.dataset.filter!;
      buttons.forEach((b) => b.setAttribute("aria-selected", String(b === btn)));
      const state = Flip.getState(items);
      items.forEach((c) => c.classList.toggle("is-hidden", f !== "all" && c.dataset.cat !== f));
      Flip.from(state, {
        duration: 0.55,
        ease: "power3.inOut",
        absolute: true,
        onEnter: (els) => gsap.fromTo(els, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.45 }),
        onLeave: (els) => gsap.to(els, { opacity: 0, duration: 0.3 }),
        onComplete: () => ScrollTrigger.refresh(),
      });
    }),
  );
}
