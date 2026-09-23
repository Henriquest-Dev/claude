import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { blobMarkup } from "../lib/blob";

gsap.registerPlugin(Flip);

/** "Trabalhos selecionados" with animated category filters (GSAP Flip). */
const PROJECTS = [
  { cat: "websites", label: "Websites", kind: "Projeto conceptual", title: "Lumina Studio & Arquitetura", text: "Website institucional editorial com tipografia minimalista, carregamento instantâneo e portfólio de alta fidelidade.", mouth: 1 },
  { cat: "aplicativos", label: "Aplicativos", kind: "Conceito", title: "Pulse Flow Operações", text: "Aplicação web interna para monitorização de inventário e despachos logísticos com interface adaptada a tablets e desktops.", mouth: 3 },
  { cat: "publicidade", label: "Publicidade", kind: "Projeto conceptual", title: "Campanha Café de Origem", text: "Conjunto de criativos estáticos e animados de baixo custo para atração de clientes locais em redes sociais com orçamento contido.", mouth: 5 },
  { cat: "marketing", label: "Marketing", kind: "Conceito", title: "Nordic Essence Mobiliário", text: "Estruturação de presença digital, posicionamento visual e fluxo de comunicação para marca de design sustentável.", mouth: 2 },
  { cat: "websites", label: "Websites", kind: "Projeto conceptual", title: "Clínica Integrativa Vita", text: "Portal de serviços de saúde com sistema visual calmo, agendamento facilitado e informações claras para os utentes.", mouth: 0 },
  { cat: "aplicativos", label: "Aplicativos", kind: "Conceito", title: "Rota Segura Gestão de Frota", text: "Painel de controlo interativo com telemetria simplificada e rotas para pequenas empresas de distribuição.", mouth: 4 },
];

export function initProjects(): void {
  const grid = document.querySelector<HTMLElement>("[data-projects]")!;
  grid.innerHTML = PROJECTS.map(
    (p, i) => `
    <article class="project" data-cat="${p.cat}" data-reveal>
      <div class="project__art">
        <b>HAV System</b><em>${p.kind}</em>
        <strong>${String(i + 1).padStart(2, "0")}</strong>
        ${blobMarkup({ mouth: p.mouth, className: "blob--static" })}
      </div>
      <div class="project__body">
        <p class="project__cat">${p.label}</p>
        <h3>${p.title}</h3>
        <p>${p.text}</p>
        <a class="link-arrow" href="#contacto">Quero um projeto assim <span aria-hidden="true">↗</span></a>
      </div>
    </article>`,
  ).join("");

  const cards = [...grid.querySelectorAll<HTMLElement>(".project")];
  const buttons = [...document.querySelectorAll<HTMLButtonElement>("[data-filter]")];

  buttons.forEach((btn) =>
    btn.addEventListener("click", () => {
      const f = btn.dataset.filter!;
      buttons.forEach((b) => b.setAttribute("aria-selected", String(b === btn)));
      const state = Flip.getState(cards);
      cards.forEach((c) => c.classList.toggle("is-hidden", f !== "all" && c.dataset.cat !== f));
      Flip.from(state, {
        duration: 0.6,
        ease: "power3.inOut",
        absolute: true,
        onEnter: (els) => gsap.fromTo(els, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.5 }),
        onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0.9, duration: 0.4 }),
        onComplete: () => ScrollTrigger.refresh(),
      });
    }),
  );
}
