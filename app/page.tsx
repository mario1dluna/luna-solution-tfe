"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";

type View = "inicio" | "servicios" | "proyectos" | "contacto" | "accesibilidad";
type Category = "Todos" | "Diseño" | "Desarrollo" | "Optimización";

type Service = {
  id: number;
  category: Exclude<Category, "Todos">;
  title: string;
  description: string;
  deliverables: string[];
  icon: string;
};

const services: Service[] = [
  { id: 1, category: "Diseño", title: "Diseño de sitios web", description: "Experiencias claras, modernas y adaptadas a la identidad de cada marca.", deliverables: ["Arquitectura de información", "Diseño responsive", "Prototipo navegable"], icon: "01" },
  { id: 2, category: "Desarrollo", title: "Desarrollo front-end", description: "Interfaces rápidas y mantenibles construidas con componentes reutilizables.", deliverables: ["React y TypeScript", "Componentes escalables", "Optimización responsive"], icon: "02" },
  { id: 3, category: "Optimización", title: "Accesibilidad web", description: "Revisión y mejora de experiencias para que puedan ser utilizadas por más personas.", deliverables: ["Semántica HTML", "Navegación por teclado", "Contraste y foco visible"], icon: "03" },
  { id: 4, category: "Diseño", title: "Sistemas de interfaz", description: "Reglas visuales y componentes que mantienen una experiencia coherente.", deliverables: ["Tokens de diseño", "Biblioteca de componentes", "Guía de uso"], icon: "04" },
  { id: 5, category: "Desarrollo", title: "Landing pages", description: "Páginas enfocadas en presentar una oferta y convertir visitas en contactos.", deliverables: ["Mensaje principal", "Secciones reutilizables", "Formulario de contacto"], icon: "05" },
  { id: 6, category: "Optimización", title: "Analítica y mejora", description: "Estructuras preparadas para medir recorridos y tomar mejores decisiones.", deliverables: ["Plan de medición", "Eventos prioritarios", "Recomendaciones UX"], icon: "06" },
];

const projects = [
  { name: "Golden State", type: "Servicios profesionales", description: "Concepto para orientar servicios documentales en español e inglés y facilitar el primer contacto.", focus: "Claridad, confianza y navegación bilingüe.", system: "Reutiliza navegación, formulario y estados; cambia identidad, contenido y requisitos del dominio.", tags: ["Web bilingüe", "Accesibilidad", "Contacto"], accent: "gold" },
  { name: "Northline Studio", type: "Marca creativa", description: "Portafolio modular que organiza capacidades, proyectos y una ruta clara para solicitar una colaboración.", focus: "Una voz editorial que deja respirar el trabajo.", system: "Reutiliza tarjetas, jerarquías y responsive; adopta una dirección visual propia.", tags: ["Portafolio", "Responsive", "Sistema visual"], accent: "blue" },
  { name: "Aster Commerce", type: "Comercio local", description: "Concepto de catálogo para descubrir productos, entender su valor y llegar a una acción concreta.", focus: "Descubrimiento, confianza y decisión.", system: "Reutiliza filtros y estados; incorpora contenido y flujos específicos de comercio.", tags: ["Catálogo", "UX", "Conversión"], accent: "cyan" },
];

const navItems: [View, string][] = [
  ["inicio", "Inicio"],
  ["servicios", "Servicios"],
  ["proyectos", "Proyectos"],
  ["contacto", "Contacto"],
];

function readStoredPreference(key: string) {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(key) === "true";
  } catch {
    return false;
  }
}

export default function Home() {
  const [view, setView] = useState<View>("inicio");
  const [category, setCategory] = useState<Category>("Todos");
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [largeText, setLargeText] = useState(() => readStoredPreference("luna-large-text"));
  const [highContrast, setHighContrast] = useState(() => readStoredPreference("luna-high-contrast"));
  const [confirmation, setConfirmation] = useState<string | null>(null);
  const dialogRef = useRef<HTMLElement | null>(null);
  const dialogTriggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    document.documentElement.dataset.text = largeText ? "large" : "standard";
    document.documentElement.dataset.contrast = highContrast ? "high" : "standard";
    try {
      localStorage.setItem("luna-large-text", String(largeText));
      localStorage.setItem("luna-high-contrast", String(highContrast));
    } catch {
      // Visual state still updates if the browser blocks storage.
    }
  }, [largeText, highContrast]);

  useEffect(() => {
    if (!selectedService || view !== "servicios") return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    const selector = "button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])";
    const getFocusable = () => Array.from(dialog.querySelectorAll<HTMLElement>(selector));
    getFocusable()[0]?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        setSelectedService(null);
        requestAnimationFrame(() => dialogTriggerRef.current?.focus());
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = getFocusable();
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selectedService, view]);

  const filteredServices = useMemo(
    () => services.filter((service) => category === "Todos" || service.category === category),
    [category],
  );

  function navigate(next: View) {
    setView(next);
    setMenuOpen(false);
    setSelectedService(null);
    requestAnimationFrame(() => document.querySelector("main")?.focus());
  }

  function openContact(service?: Service) {
    setSelectedService(service ?? null);
    setConfirmation(null);
    setView("contacto");
    setMenuOpen(false);
  }

  function openService(service: Service) {
    dialogTriggerRef.current = document.activeElement as HTMLElement | null;
    setSelectedService(service);
    setView("servicios");
  }

  function closeService() {
    setSelectedService(null);
    requestAnimationFrame(() => dialogTriggerRef.current?.focus());
  }

  function submitBrief(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const reference = `LS-${String(Date.now()).slice(-6)}`;
    setConfirmation(reference);
    event.currentTarget.reset();
  }

  return (
    <div className="site-shell">
      <a className="skip-link" href="#main-content">Saltar al contenido principal</a>
      <header className="site-header">
        <div className="header-inner">
          <button className="brand" onClick={() => navigate("inicio")} aria-label="Ir al inicio de Luna Solution">
            <span className="brand-symbol" aria-hidden="true">L</span>
            <span className="brand-name"><strong>Luna</strong><small>Solution</small></span>
          </button>
          <button className="menu-button" aria-expanded={menuOpen} aria-controls="primary-navigation" onClick={() => setMenuOpen((open) => !open)}>
            <span aria-hidden="true">☰</span> Menú
          </button>
          <nav id="primary-navigation" className={menuOpen ? "main-nav open" : "main-nav"} aria-label="Navegación principal">
            {navItems.map(([key, label]) => <button key={key} className={view === key ? "active" : ""} onClick={() => navigate(key)}>{label}</button>)}
            <button className={`accessibility-link ${view === "accesibilidad" ? "active" : ""}`} onClick={() => navigate("accesibilidad")}><span aria-hidden="true">Aa</span> Ajustes de lectura</button>
          </nav>
        </div>
      </header>

      <main id="main-content" tabIndex={-1}>
        {view === "inicio" && (
          <>
            <section className="hero" aria-labelledby="hero-title">
              <div className="hero-copy-wrap">
                <p className="eyebrow light">Estudio de diseño y desarrollo web</p>
                <h1 id="hero-title">Tu negocio merece una web que se entienda y se <em>recuerde.</em></h1>
                <p className="hero-copy"><strong>Luna Solution crea páginas web para negocios y profesionales</strong> que necesitan explicar sus servicios, generar confianza y convertir visitas en contactos.</p>
                <div className="hero-actions">
                  <button className="button bright" onClick={() => navigate("servicios")}>Ver servicios y entregables <span aria-hidden="true">→</span></button>
                  <button className="button ghost" onClick={() => openContact()}>Crear un brief de proyecto</button>
                </div>
                <dl className="offer-map" aria-label="Qué ofrece Luna Solution">
                  <div><dt>Qué hacemos</dt><dd>Diseño y desarrollo de páginas web.</dd></div>
                  <div><dt>Para quién</dt><dd>Negocios, profesionales y organizaciones.</dd></div>
                  <div><dt>Qué recibes</dt><dd>Una interfaz responsive, accesible y preparada para crecer.</dd></div>
                </dl>
              </div>
              <div className="hero-stage" aria-label="Vista conceptual del sistema de interfaz Luna">
                <div className="orbit orbit-one" aria-hidden="true"></div><div className="orbit orbit-two" aria-hidden="true"></div>
                <div className="workspace-card">
                  <div className="workspace-bar"><span className="workspace-logo">L</span><span>Nuevo proyecto</span><i></i><i></i><i></i></div>
                  <div className="workspace-body">
                    <div className="workspace-nav"><span className="selected"></span><span></span><span></span><span></span></div>
                    <div className="workspace-content"><p>IDENTIDAD DIGITAL</p><h2>Una estructura.<br />Muchas soluciones.</h2><div className="workspace-lines"><span></span><span></span></div><div className="workspace-tiles"><span>Web</span><span>UX</span><span>AA</span></div></div>
                  </div>
                </div>
                <div className="floating-chip chip-one"><strong>100%</strong><span>Responsive</span></div>
                <div className="floating-chip chip-two"><strong>AA</strong><span>Accesible</span></div>
              </div>
            </section>

            <section className="value-band" aria-label="Proceso de Luna Solution">
              <p><strong>Tu identidad dirige el diseño.</strong> El sistema mantiene claridad, accesibilidad y coherencia.</p>
              <div><span>01</span> Descubrir</div><div><span>02</span> Diseñar</div><div><span>03</span> Desarrollar</div><div><span>04</span> Mejorar</div>
            </section>

            <section className="home-services" aria-labelledby="home-services-title">
              <div className="section-heading"><div><p className="eyebrow">Soluciones digitales</p><h2 id="home-services-title">Todo lo necesario para construir una presencia web sólida.</h2></div><button className="text-link" onClick={() => navigate("servicios")}>Ver todos los servicios <span aria-hidden="true">↗</span></button></div>
              <div className="featured-grid">
                {services.slice(0, 3).map((service) => <article className="featured-card" key={service.id}><span>{service.icon}</span><p>{service.category}</p><h3>{service.title}</h3><p>{service.description}</p><button onClick={() => openService(service)}>Ver qué incluye <span aria-hidden="true">→</span></button></article>)}
              </div>
            </section>
          </>
        )}

        {view === "servicios" && (
          <section className="page-section" aria-labelledby="services-title">
            <div className="page-hero"><p className="eyebrow light">Servicios</p><h1 id="services-title">Soluciones pensadas para crecer contigo.</h1><p>Combinamos estrategia, diseño y desarrollo para crear experiencias digitales coherentes y reutilizables.</p></div>
            <div className="filter-row" role="group" aria-label="Filtrar servicios">{(["Todos", "Diseño", "Desarrollo", "Optimización"] as Category[]).map((item) => <button key={item} aria-pressed={category === item} className={category === item ? "selected" : ""} onClick={() => setCategory(item)}>{item}</button>)}</div>
            <div className="service-list">
              {filteredServices.map((service) => <article className="service-row" key={service.id}><span className="service-number">{service.icon}</span><div><p className="service-category">{service.category}</p><h2>{service.title}</h2><p>{service.description}</p></div><ul>{service.deliverables.map((item) => <li key={item}><span aria-hidden="true">✓</span>{item}</li>)}</ul><button className="round-button" aria-label={`Ver detalles de ${service.title}`} onClick={() => openService(service)}>→</button></article>)}
            </div>
          </section>
        )}

        {view === "proyectos" && (
          <section className="page-section" aria-labelledby="projects-title">
            <div className="page-hero"><p className="eyebrow light">Proyectos</p><h1 id="projects-title">Una base flexible para distintas marcas.</h1><p>Cada concepto demuestra cómo Luna Interface System puede adaptarse sin perder claridad ni consistencia.</p></div>
            <div className="projects-grid">
              {projects.map((project, index) => <article className={`project-card ${project.accent}`} key={project.name}><div className="project-preview"><div className="preview-top"><span></span><i></i><i></i></div><div className="preview-copy"><small>{project.type}</small><strong>{project.name}</strong><span></span><span></span><span className="preview-action">Explorar concepto</span></div></div><p className="project-index">0{index + 1} / CASO CONCEPTUAL</p><h2>{project.name}</h2><p>{project.description}</p><dl className="project-details"><div><dt>Enfoque</dt><dd>{project.focus}</dd></div><div><dt>Sistema y marca</dt><dd>{project.system}</dd></div></dl><div className="tag-row">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></article>)}
            </div>
            <div className="template-note"><div><p className="eyebrow">Sistema reutilizable</p><h2>La misma estructura puede convertirse en una web para Golden State.</h2></div><p>Se sustituyen identidad, contenidos y servicios, mientras se conservan navegación, jerarquías, componentes, accesibilidad y comportamiento responsive.</p></div>
          </section>
        )}

        {view === "contacto" && (
          <section className="contact-layout" aria-labelledby="contact-title">
            <div className="contact-intro"><p className="eyebrow light">Inicia un proyecto</p><h1 id="contact-title">Cuéntanos qué solución necesitas.</h1><p>Este formulario es una demostración académica. No envía información a ningún servidor.</p><div className="contact-points"><div><span>01</span><p><strong>Respuesta clara</strong>Definimos el alcance y las prioridades.</p></div><div><span>02</span><p><strong>Proceso accesible</strong>Diseñamos para personas y dispositivos diversos.</p></div><div><span>03</span><p><strong>Base reutilizable</strong>Construimos componentes preparados para crecer.</p></div></div></div>
            <form className="brief-form" onSubmit={submitBrief}>
              {confirmation && <div className="success-message" role="status"><strong>Brief creado correctamente</strong><p>Referencia de demostración: {confirmation}</p></div>}
              <label htmlFor="name">Nombre</label><input id="name" name="name" autoComplete="name" required />
              <label htmlFor="email">Correo electrónico</label><input id="email" name="email" type="email" autoComplete="email" required />
              <label htmlFor="project-type">Tipo de solución</label><select id="project-type" name="project-type" defaultValue={selectedService?.title ?? ""} required><option value="" disabled>Selecciona una opción</option>{services.map((service) => <option key={service.id}>{service.title}</option>)}</select>
              <label htmlFor="goal">¿Qué quieres conseguir?</label><textarea id="goal" name="goal" rows={5} placeholder="Describe brevemente tu proyecto" required></textarea>
              <label className="check-label"><input type="checkbox" required /><span>Confirmo que utilizaré únicamente datos ficticios en este prototipo.</span></label>
              <button className="button bright form-submit" type="submit">Crear brief de proyecto <span aria-hidden="true">→</span></button>
            </form>
          </section>
        )}

        {view === "accesibilidad" && (
          <section className="page-section narrow" aria-labelledby="accessibility-title">
            <div className="page-hero"><p className="eyebrow light">Ajustes de lectura</p><h1 id="accessibility-title">Lee Luna Solution a tu manera.</h1><p>Los cambios se aplican en todas las vistas y se conservan cuando vuelves a abrir la aplicación.</p></div>
            <div className="settings-panel"><div className="setting"><div><span aria-hidden="true">Aa</span><h2>Texto ampliado</h2><p>Aumenta el tamaño general y mejora la legibilidad.</p></div><div className="setting-control"><span aria-live="polite">{largeText ? "Activado" : "Desactivado"}</span><button className="switch" role="switch" aria-checked={largeText} aria-label="Texto ampliado" onClick={() => setLargeText((value) => !value)}><span></span></button></div></div><div className="setting"><div><span aria-hidden="true">◐</span><h2>Contraste reforzado</h2><p>Aumenta la diferencia entre texto, fondo y controles.</p></div><div className="setting-control"><span aria-live="polite">{highContrast ? "Activado" : "Desactivado"}</span><button className="switch" role="switch" aria-checked={highContrast} aria-label="Contraste reforzado" onClick={() => setHighContrast((value) => !value)}><span></span></button></div></div></div>
            <div className="keyboard-note"><strong>Navegación por teclado</strong><p>Utiliza Tab para recorrer controles, Enter o Espacio para activarlos y el enlace de salto para llegar directamente al contenido.</p></div>
          </section>
        )}
      </main>

      {view !== "accesibilidad" && <button className="reading-dock" onClick={() => navigate("accesibilidad")}><span aria-hidden="true">Aa</span><span><strong>Ajustes de lectura</strong><small>{largeText || highContrast ? "Preferencias activas" : "Texto y contraste"}</small></span></button>}

      <footer><div className="footer-brand"><span className="brand-symbol">L</span><p><strong>Luna Solution</strong><small>Soluciones digitales claras y accesibles.</small></p></div><div><p>Prototipo académico desarrollado con Luna Interface System.</p><p>© 2026 · Diseño y desarrollo front-end</p></div></footer>

      {selectedService && view === "servicios" && (
        <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) closeService(); }}><section ref={dialogRef} className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" aria-describedby="modal-description"><button className="modal-close" onClick={closeService} aria-label="Cerrar detalles">×</button><span className="modal-number">{selectedService.icon}</span><p className="eyebrow">{selectedService.category}</p><h2 id="modal-title">{selectedService.title}</h2><p id="modal-description">{selectedService.description}</p><h3>Esto es lo que recibes</h3><ul>{selectedService.deliverables.map((item) => <li key={item}><span aria-hidden="true">✓</span>{item}</li>)}</ul><button className="button primary full" onClick={() => openContact(selectedService)}>Crear un brief para este servicio <span aria-hidden="true">→</span></button></section></div>
      )}
    </div>
  );
}
