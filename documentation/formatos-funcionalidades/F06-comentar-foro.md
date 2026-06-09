# Formato de Funcionalidad F06 — Comentar foro

| Campo | Valor |
|-------|-------|
| **Proyecto** | UNAC Forum |
| **Código** | F06 |
| **Nombre** | Comentar foro |
| **Tipo** | Principal |
| **Módulo** | Foro / Interacción |
| **Prioridad** | Media |
| **Actor** | Usuario autenticado |

---

## Descripción

Permite al usuario agregar comentarios de texto a una publicación existente, visualizar los comentarios previos y participar en la conversación del anuncio.

---

## Precondiciones

- El usuario debe tener sesión activa.
- La publicación debe existir.
- El texto del comentario no debe estar vacío.
- El comentario no debe superar 500 caracteres.

## Postcondiciones

- El comentario queda almacenado como subdocumento en la publicación.
- El comentario incluye `idAutor`, `nombreAutor`, `texto` y `fechaIso`.
- El contador `cantidadComentarios` se actualiza.
- La sección de comentarios de la tarjeta muestra el nuevo comentario.

---

## Datos de entrada

| Campo | Tipo | Obligatorio | Validación |
|-------|------|-------------|------------|
| `id` | String (URL param) | Sí | ID de publicación válido |
| `texto` | String (body) | Sí | No vacío, máx. 500 caracteres |

## Datos de salida

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `publicacion` | Object | Publicación con arreglo `comentarios` actualizado |

---

## Flujo principal

1. El usuario localiza una publicación en el feed.
2. Pulsa **«Comentar»** o **«Comentarios (N)»**.
3. Se expande el panel de comentarios (`seccion-comentarios`).
4. Se muestran comentarios existentes o mensaje *«Sé el primero en comentar.»*
5. El usuario escribe en el textarea.
6. Pulsa **«Publicar comentario»**.
7. El frontend valida longitud y contenido.
8. Se envía `POST /api/publicaciones/:id/comentarios` con `{ texto }`.
9. El backend agrega el subdocumento con `$push`.
10. Toast de éxito y actualización de la tarjeta en el estado local.

---

## Flujos alternos

| ID | Condición | Acción del sistema |
|----|-----------|-------------------|
| FA-01 | Comentario vacío | *«Escribe un comentario antes de publicar.»* |
| FA-02 | Comentario > 500 caracteres | Error de validación |
| FA-03 | Publicación no encontrada | HTTP 404 |
| FA-04 | Error de red | Mensaje de error bajo el textarea |
| FA-05 | Colapsar panel | Pulsa de nuevo el botón de comentarios |

---

## Reglas de negocio

- RN-01: Cualquier usuario autenticado puede comentar cualquier publicación.
- RN-02: El autor del comentario es el usuario en sesión.
- RN-03: Los comentarios no se pueden editar ni eliminar en esta versión.
- RN-04: La fecha del comentario se asigna automáticamente al crear.

---

## Casos de prueba sugeridos

| ID | Caso | Resultado esperado |
|----|------|-------------------|
| CP-01 | Comentario válido en publicación sin comentarios | Comentario visible, contador = 1 |
| CP-02 | Comentario vacío | Error en formulario |
| CP-03 | Comentario de 501 caracteres | Error de validación |
| CP-04 | Varios usuarios comentan la misma publicación | Todos los comentarios visibles |
| CP-05 | Expandir/contraer panel | Panel alterna visibilidad |

---

## Archivos relacionados

| Capa | Archivo |
|------|---------|
| Frontend | `src/pages/Feed.jsx` (componente `PostCard`) |
| Frontend | `src/services/publicacionService.js` |
| Backend | `controllers/publicacionController.js` (función `agregarComentario`) |
| Backend | `models/Publicacion.js` (subdocumento comentarios) |

---

*Formato F06 — UNAC Forum — Entrega Final*
