# ComfyChair

Sistema para organizar conferencias científicas: envío, revisión y selección de artículos.

Este repositorio contiene el código base para el **Trabajo Práctico — Parte 1** de Técnicas y Herramientas de Ingeniería de Software (Maestría en IS - NLP, 2026).

---

## Tecnologías

- **Node.js** (v18+)
- **Jest** 29 — framework de testing
- **crypto** (built-in de Node) — hash SHA-256 de contraseñas

---

## Instalación

```bash
npm install
```

---

## Tests

Ejecutar todos los tests:

```bash
npm test
```

Ejecutar con reporte de cobertura:

```bash
npm run test:coverage
```

> Cobertura actual: **99%+** (56 tests)

---

## Estructura del proyecto

```
src/
  constants/
    Stages.js          # Enum de etapas: Receiving, Bidding, Assignment, Reviewing, Selection
    Interests.js       # Enum de intereses: Interested, Maybe, NotInterested, Conflict
  User.js              # Usuario registrado (nombre, afiliación, email, password hasheado)
  Paper.js             # Clase base para artículos (título, autores, reviews, score)
  RegularPaper.js      # Artículo regular con abstract (≤ 300 palabras)
  Poster.js            # Poster con URL de adjunto y fuentes
  Review.js            # Revisión de un artículo (texto + puntaje -3 a +3)
  Bid.js               # Expresión de interés de un revisor sobre un paper
  Conference.js        # Conferencia con chairs y sesiones
  Session.js           # Sesión/track: gestiona el flujo completo de etapas
simulacion.js          # Simulación completa del flujo de una conferencia
tests/
  Paper.test.js
  RegularPaper.test.js
  Poster.test.js
  Bid.test.js
  Review.test.js
  Session.test.js
```

---

## Flujo de una sesión

Cada sesión avanza secuencialmente por cinco etapas:

|     Etapa      |  Método de cierre    |                           Descripción                                     |
|----------------|----------------------|---------------------------------------------------------------------------|
| **Receiving**  | `closeSubmissions()` | Los autores envían papers. Se pueden modificar hasta el cierre.           |
| **Bidding**    | `closeBidding()`     | Los revisores expresan su interés en cada paper.                          |
| **Assignment** | `closeAssignment()`  | Se asignan automáticamente 3 revisores por paper según prioridad de bids. |
| **Reviewing**  | `closeReviewing()`   | Los revisores asignados cargan su revisión (texto + puntaje).             |
| **Selection**  |          —           | Se seleccionan papers por corte fijo (top N% por score).                  |

---

## Lo implementado

Sobre el código base provisto por la cátedra se implementó:

- **Asignación automática de revisores** (`closeBidding`): algoritmo de prioridad Interested › Maybe › sin bid › NotInterested, con cuota máxima por revisor y exclusión por conflicto de interés (autor del paper).
- **Etapa Assignment separada de Reviewing**: `closeAssignment()` como transición explícita.
- **Carga de revisiones** (`submitReview`): solo revisores asignados, puntaje entre -3 y +3, máximo 3 revisiones por paper.
- **Modificación de papers** (`updatePaper`): permite actualizar un paper ya enviado mientras la sesión esté en Receiving.
- **Selección por corte fijo** (`selectPapers`): acepta el top N% de papers ordenados por score descendente.
- **Nombre en el constructor de Session**: `new Session("Nombre del track")`.

---

## Convenciones

- Orientación a objetos: cada clase tiene responsabilidades claras
- Sin lambdas ni funciones anónimas, salvo en la API de colecciones (`map`, `filter`, `reduce`, etc.)
- Constantes como enums con `Object.freeze` + `Symbol`
- Contraseñas hasheadas con SHA-256 (Node `crypto`)

---

## Enunciado

El enunciado completo está en [`ENUNCIADO.md`](./ENUNCIADO.md).

---

## Lo que está implementado

El código base cubre el modelo de dominio y las dos primeras etapas del flujo de una sesión:

- **Modelo**: `User`, `Paper`, `RegularPaper`, `Poster`, `Review`, `Bid`, `Conference`
- **Session**: etapa de `Receiving` (submit con validación de formato) y `Bidding` (registro y modificación de bids)

---

## Lo que deben implementar

Las secciones 4.1, 4.2 y 4.3 del enunciado:

1. **Asignación de revisores** — algoritmo de asignación por prioridad de bids, con distribución equitativa y exclusión por conflicto de interés
2. **Carga de revisiones** — los revisores asignados ingresan texto y puntaje
3. **Selección por corte fijo** — aceptación de artículos en orden decreciente de score hasta un porcentaje configurado

Cada bloque debe estar cubierto por tests unitarios.

---

## Lo que se implementó (TP)

1. **Asignación automática de revisores** — al cerrar el bidding se asignan 3 revisores por paper en orden de prioridad de bids, con cuota máxima por revisor y exclusión por conflicto de interés
2. **Etapa Assignment separada de Reviewing** — `closeAssignment()` como transición explícita entre ambas
3. **Carga de revisiones** — los revisores asignados ingresan texto y puntaje (-3 a +3), máximo 3 revisiones por paper
4. **Modificación de papers** — `updatePaper()` permite actualizar un paper enviado mientras la sesión esté en Receiving
5. **Selección por corte fijo** — `selectPapers(N)` acepta el top N% de papers ordenados por score descendente

---

## Simulación

El archivo `simulacion.js` en la raíz del proyecto ejecuta una conferencia completa de extremo a extremo.

```bash
node simulacion.js
```

### Escenario

- **Conferencia**: AWS 2026 — 2 chairs, 15 usuarios, 2 sesiones
- **Sesión 1** — `Serverless architecture`: 2 papers (Paper base + RegularPaper), 5 revisores, flujo completo de 5 etapas
- **Sesión 2** — `S3 bucket management`: 1 paper (Poster), 3 revisores con conflicto de interés, caso de pool reducido

### Casos de negocio contemplados

| # | Caso | Resultado esperado |
|---|------|--------------------|
| 1 | Enviar un paper después de `closeSubmissions()` | Error: la sesión ya no está en Receiving |
| 2 | Ingresar un bid después de `closeBidding()` | Error: la sesión ya no está en Bidding |
| 3 | Revisores que son autores del paper | Excluidos automáticamente de la asignación (conflicto de interés) |
| 4 | Solo 1 revisor elegible tras excluir conflictos | El sistema asigna los disponibles y genera score con las reviews existentes |
| 5 | Bids con `NotInterested` | Considerados con menor prioridad; el revisor puede ser asignado si no hay otros candidatos |
| 6 | Pool de 1 paper con corte del 60% | `Math.floor(1 × 0.6) = 0` → ningún paper aceptado (comportamiento esperado con pocos papers) |
| 7 | Modificar un paper durante `Receiving` | El abstract se actualiza y `updatePaper()` lo valida correctamente |
| 8 | Modificar un paper después de `closeSubmissions()` | Error: la sesión ya no está en etapa Receiving |

