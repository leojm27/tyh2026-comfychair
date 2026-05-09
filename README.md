# ComfyChair

Sistema para organizar conferencias científicas: envío, revisión y selección de artículos.

Este repositorio contiene el código base para el **Trabajo Práctico — Parte 1** de Técnicas y Herramientas de Ingeniería de Software (Maestría en IS - UNLP, 2026).

---

## Estructura del proyecto

```
src/
  User.js            # Usuario registrado en el sistema
  Paper.js           # Clase base para artículos
  RegularPaper.js    # Artículo regular (con abstract)
  Poster.js          # Poster (con URL de fuentes)
  Review.js          # Revisión de un artículo
  Bid.js             # Expresión de interés de un revisor
  Conference.js      # Conferencia con chairs y sesiones
  Session.js         # Sesión/track con su flujo de etapas
tests/
  Paper.test.js
  RegularPaper.test.js
  Poster.test.js
  Bid.test.js
  Session.test.js
```

---

## Setup

```bash
npm install
npm test
```

Para ver cobertura:

```bash
npm test -- --coverage
```

---

## Enunciado

El enunciado completo está en [`ENUNCIADO.md`](./ENUNCIADO.md).

---

## Lo que está implementado

El código base cubre el modelo de dominio y las dos primeras etapas del flujo de una sesión:

- **Modelo**: `User`, `Paper`, `RegularPaper`, `Poster`, `Review`, `Bid`, `Conference`
- **Session**: etapa de `Receiving` (submit con validación de formato) y `Bidding` (registro y modificación de bids)

Los tests provistos verifican este comportamiento y deben mantenerse en verde.

## Lo que deben implementar

Las secciones 4.1, 4.2 y 4.3 del enunciado:

1. **Asignación de revisores** — algoritmo de asignación por prioridad de bids, con distribución equitativa y exclusión por conflicto de interés
2. **Carga de revisiones** — los revisores asignados ingresan texto y puntaje
3. **Selección por corte fijo** — aceptación de artículos en orden decreciente de score hasta un porcentaje configurado

Cada bloque debe estar cubierto por tests unitarios.

---

## Convenciones

- Orientación a objetos estricta: cada clase tiene responsabilidades claras
- Sin lambdas ni funciones anónimas, salvo en la API de colecciones (`map`, `filter`, `reduce`, etc.)
- Cualquier decisión de diseño sobre el enunciado debe quedar registrada en el documento de decisiones

---

## Entrega

**Fecha límite: 29 de mayo de 2026. Grupos de 2 o 3 personas.**

Repositorio GitHub con historia de commits que refleje la contribución de cada integrante.
