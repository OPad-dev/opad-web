# opad-web

## Coordinación de Agent Skills

Las skills de `.claude/skills/` son complementarias: cada dominio tiene una skill responsable. Carga **solo** la skill (o las dos como mucho) que encaje con la tarea actual. No precargues skills "por si acaso" ni encadenes varias del mismo dominio. En ediciones triviales (copy, renombrados, ajustes de una línea) no cargues ninguna.

Prioridad cuando hay conflicto: instrucciones del usuario > este archivo > `PRODUCT.md`/`DESIGN.md` del proyecto (si existen) > texto de la skill.

### Responsable por dominio

| Dominio | Skill principal | Uso secundario (solo si aplica) |
|---|---|---|
| APIs de plataforma web, estándares, compatibilidad | `modern-web-guidance` | — |
| Dirección artística, diseño visual, refinamiento de UI | `impeccable` | `emil-design-eng` (pulido de interacción de un componente) |
| Eliminar patrones genéricos de UI "hecha por IA" | `unslop` | — |
| Animaciones, transiciones, microinteracciones, gestos | `animate`, `choreograph`, `gestures`, `animation-performance`, `review-animations`, `improve-animations`, `remove-animations`, `find-animation-opportunities` | `animation-vocabulary` |
| Rendimiento web, accesibilidad, SEO, Core Web Vitals | `performance`, `core-web-vitals`, `accessibility`, `seo`, `web-quality-audit` | `best-practices` (solo dentro de una auditoría completa) |
| Arquitectura, planificación, testing, seguridad, calidad del código | skills de Addy Osmani (`spec-driven-development`, `planning-and-task-breakdown`, `test-driven-development`, `security-and-hardening`, `code-review-and-quality`, `debugging-and-error-recovery`, etc.) | — |

### Reglas para resolver solapamientos

1. **Diseño visual:** `impeccable` es el responsable. `unslop` solo se usa cuando el objetivo explícito es quitar el aspecto "AI-generated" o el usuario pide "unslop". No ejecutes pasadas completas de ambas sobre la misma pantalla en un mismo turno. Si se usan las dos, primero `unslop` (diagnóstico y limpieza) y después `impeccable` (dirección), y la dirección la marca `impeccable`. En este repo no uses `frontend-design` (plugin global), `frontend-ui-engineering` ni `apple-design` para decidir la dirección visual. `frontend-ui-engineering` queda para arquitectura de componentes y estado.
2. **Movimiento:** las skills de Emil Kowalski son las responsables. Usa `/impeccable animate` y su `impeccable-motion-reviewer` solo si el usuario los invoca de forma explícita. En la pasada de motion de `unslop`, limítate a quitar el motion "slop" (pulsos, glows animados) y deja el movimiento nuevo a `animate`. Las duraciones y curvas las decide la skill de Emil, salvo que `DESIGN.md` diga otra cosa.
3. **Plataforma web:** consulta `modern-web-guidance` al elegir o implementar una API o patrón de plataforma (dialog, popover, anchor positioning, container queries, view transitions, formularios, etc.), no en cada edición de HTML/CSS. Haz una búsqueda por capacidad y recupera solo los guides relevantes. Mantén su sección de cierre "### Modern Web Guidance" cuando la hayas usado.
4. **Rendimiento y accesibilidad:** en frontend, las responsables son `performance`, `core-web-vitals` y `accessibility`. Usa `performance-optimization` solo para backend, consultas o BD; `accessibility-engineering`, solo si se pide una auditoría automatizada con axe-core/pa11y; y `animation-performance`, solo para jank de animaciones. Si se pide aplicar un patrón concreto, `modern-web-guidance` dicta la implementación y `accessibility` la verifica.
5. **Seguridad:** `security-and-hardening` es la responsable. `best-practices` (web-quality) solo dentro de `web-quality-audit`.
6. **Revisión y simplificación:** si el usuario escribe `/code-review`, `/simplify` o `/security-review`, usa el comando integrado de Claude Code. Peticiones en lenguaje natural ("revisa esto", "simplifica") → `code-review-and-quality` / `code-simplification`.
7. **Skills de proceso** (`test-driven-development`, `incremental-implementation`, `git-workflow-and-versioning`, `doubt-driven-development`, `spec-driven-development`, `interview-me`, `constraint-driven-development`, `context-engineering`): sus descripciones se activan con mucha facilidad. Cárgalas solo en trabajo no trivial que cuadre claramente con ellas o cuando el usuario las pida. `git-workflow-and-versioning` solo al hacer commits, ramas o releases, y nunca hagas commit sin que el usuario lo pida. TDD solo si existe infraestructura de tests o se pide.
8. **Solo invocables por el usuario** (`disable-model-invocation`): `ask-emil`, `learn-taste`, `pick-ui-library`, `prototype`, `review-animations`. No las simules por tu cuenta.

### Entorno

- Las sesiones de Claude Code en este repo usan el Node por defecto de nvm (≥22) gracias al hook `.claude/hooks/use-nvm-node.sh`. Lo necesitan `npx modern-web-guidance` y `npx skills`. El Node del sistema (`/usr/bin/node`, 18.x) no es compatible.
- Opcionales: Playwright y Chromium (`unslop` snapshot/story), ffmpeg (vídeos de `unslop`) y el MCP chrome-devtools (no instalado).
