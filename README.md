# Luna Solution

Aplicación web de página única desarrollada para el Trabajo Fin de Estudios de Mario Bismarck Luna Chamorro. El proyecto presenta un estudio ficticio de soluciones digitales y aplica **Luna Interface System** como base de componentes, estados, tokens visuales y criterios de accesibilidad reutilizables.

## Funciones

- Navegación entre Inicio, Servicios, Proyectos, Contacto y Ajustes de lectura sin recarga completa.
- Catálogo de seis servicios con filtros y detalles contextuales.
- Tres casos conceptuales, incluida la transferencia futura a Golden State.
- Brief académico con validación nativa, selección contextual y confirmación local.
- Texto ampliado y contraste reforzado persistidos en el navegador.
- Diálogo con cierre por Escape, ciclo de foco y devolución al control de origen.
- Diseño responsive, foco visible, enlace de salto y reducción de movimiento.

El prototipo no envía ni conserva los datos introducidos en el brief. No utiliza backend, autenticación, pagos ni datos de clientes reales.

## Tecnologías

- React 19
- TypeScript 5
- Next.js/Vinext
- CSS con propiedades personalizadas y media queries
- Node.js 22.13 o superior

## Ejecución local

```bash
npm ci
npm run dev
```

La aplicación quedará disponible en la dirección indicada por el servidor de desarrollo.

## Verificación

```bash
npm run lint
npm run build
node --test tests/rendered-html.test.mjs
```

La versión 4 fue sometida a estas tres comprobaciones antes del predepósito. La evaluación piloto previa reunió seis participantes y obtuvo una media SUS de 66,25 sobre 100. Sus hallazgos motivaron la revisión de la propuesta de valor, el acceso a preferencias, la legibilidad móvil, el contenido de proyectos y el foco del diálogo. La eficacia de esta iteración requiere una segunda medición y no se presenta como validada.

## Estructura principal

- `app/page.tsx`: contenido, vistas, estado e interacción.
- `app/globals.css`: tokens, componentes, estados y responsive.
- `app/layout.tsx`: idioma y metadatos.
- `public/`: favicon e imagen para compartir.
- `tests/`: prueba del artefacto HTML.

## Despliegue de referencia

La versión académica está disponible en [Luna Solution](https://luna-civic-tfe.mario1dluna.chatgpt.site). El identificador histórico del dominio conserva el nombre inicial del proyecto, pero la aplicación y sus metadatos corresponden a Luna Solution.

Este repositorio acompaña una memoria académica; los proyectos mostrados son conceptuales y no representan clientes ni resultados comerciales reales.
