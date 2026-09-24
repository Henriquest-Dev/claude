import { tr } from "../i18n";

/** Builds the selected-work list (animated by the stage timeline). */
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

export function buildProjects(): void {
  const list = document.querySelector<HTMLElement>("[data-projects]")!;
  list.innerHTML = PROJECTS.map(
    (p, i) => `
    <li class="project">
      <a href="#contacto" data-scroll-to="contact">
        <span class="project__num">${String(i + 1).padStart(2, "0")}</span>
        <span class="project__title">${p.title}</span>
        <span class="project__text">${p.text}</span>
        <span class="project__cat">${p.label}</span>
        <span class="project__arrow" aria-hidden="true">↗</span>
      </a>
    </li>`,
  ).join("");

}
