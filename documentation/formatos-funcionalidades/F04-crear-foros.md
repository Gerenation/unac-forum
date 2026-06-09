# Formato de Funcionalidad F04 — Crear foros (publicaciones)

| Campo | Valor |
|-------|-------|
| **Proyecto** | UNAC Forum |
| **Código** | F04 |
| **Nombre** | Crear foros (publicaciones) |
| **Tipo** | Principal |
| **Módulo** | Foro / Publicaciones |
| **Prioridad** | Alta |
| **Actor** | Usuario autenticado |

---

## Descripción

Permite al usuario autenticado publicar un nuevo anuncio en el tablón del foro, indicando título, descripción y entre una y cinco categorías que describan la intención del contenido.

---

## Precondiciones

- El usuario debe tener sesión activa.
- El título no debe estar vacío (máx. 60 caracteres).
- El contenido no debe estar vacío.
- Debe seleccionarse al menos 1 categoría y como máximo 5.
- Las categorías deben pertenecer al enum válido del sistema.

## Postcondiciones

- Se crea un documento en la colección `publicaciones` de MongoDB.
- La publicación queda asociada al usuario en sesión como autor.
- La publicación es visible en el feed ordenado por fecha.
- El usuario es redirigido a `/explorar` con notificación de éxito.

---

## Datos de entrada

| Campo | Tipo | Obligatorio | Validación |
|-------|------|-------------|------------|
| `titulo` | String | Sí | No vacío, máx. 60 caracteres |
| `contenido` | String | Sí | No vacío |
| `categorias` | String[] | Sí | 1–5 valores del enum |

## Datos de salida

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `publicacion` | Object | Publicación creada con id, autor, fecha, categorías |

---

## Flujo principal

1. El usuario pulsa **«Nueva publicación»** en el feed.
2. Accede a `/nueva-publicacion`.
3. Completa título, selecciona categorías (checkboxes) y escribe la descripción.
4. Pulsa **«Publicar en el foro»**.
5. El frontend valida campos localmente.
6. Se envía `POST /api/publicaciones` con `{ titulo, contenido, categorias }`.
7. El backend asigna `idAutor` y `nombreAutor` desde `req.usuario`.
8. Se persiste la publicación y se devuelve el objeto serializado.
9. Toast de éxito y redirección al feed.

---

## Flujos alternos

| ID | Condición | Acción del sistema |
|----|-----------|-------------------|
| FA-01 | Título o contenido vacío | *«Completa el título y la descripción.»* |
| FA-02 | Sin categorías seleccionadas | *«Selecciona al menos una categoría…»* |
| FA-03 | Más de 5 categorías | Toast: límite máximo alcanzado |
| FA-04 | Título mayor a 60 caracteres | Error de validación |
| FA-05 | Categoría inválida en API | HTTP 400 con mensaje |
| FA-06 | Sin sesión | Redirección a `/login` |

---

## Reglas de negocio

- RN-01: El autor de la publicación es siempre el usuario en sesión.
- RN-02: `nombreAutor` se desnormaliza desde `nombreCompleto` del usuario.
- RN-03: Mínimo 1 y máximo 5 categorías por publicación.
- RN-04: La fecha de publicación se asigna automáticamente al momento de crear.

---

## Casos de prueba sugeridos

| ID | Caso | Resultado esperado |
|----|------|-------------------|
| CP-01 | Publicación válida con 2 categorías | Aparece en feed con ambos chips |
| CP-02 | Sin categorías | Error en formulario |
| CP-03 | Título de 61 caracteres | Error de validación |
| CP-04 | Solo título sin descripción | Error en formulario |
| CP-05 | 5 categorías seleccionadas | Publicación creada correctamente |

---

## Archivos relacionados

| Capa | Archivo |
|------|---------|
| Frontend | `src/pages/NuevaPublicacion.jsx` |
| Frontend | `src/services/publicacionService.js` |
| Frontend | `src/constants/categorias.js` |
| Backend | `controllers/publicacionController.js` (función `crear`) |
| Backend | `models/Publicacion.js` |

---

*Formato F04 — UNAC Forum — Entrega Final*
