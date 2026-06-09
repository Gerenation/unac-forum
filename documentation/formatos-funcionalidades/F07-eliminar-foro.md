# Formato de Funcionalidad F07 — Eliminar foro

| Campo | Valor |
|-------|-------|
| **Proyecto** | UNAC Forum |
| **Código** | F07 |
| **Nombre** | Eliminar foro |
| **Tipo** | Principal |
| **Módulo** | Foro / Publicaciones |
| **Prioridad** | Media |
| **Actor** | Usuario autenticado (autor de la publicación) |

---

## Descripción

Permite al autor de una publicación eliminarla permanentemente del foro, previa confirmación del usuario. La acción no es reversible.

---

## Precondiciones

- El usuario debe tener sesión activa.
- El usuario en sesión debe ser el autor de la publicación (`idAutor === usuario.id`).
- La publicación debe existir en la base de datos.
- El usuario debe confirmar la acción en el diálogo del navegador.

## Postcondiciones

- El documento de la publicación se elimina de MongoDB.
- La publicación desaparece del feed sin recargar la página completa.
- Si el panel de comentarios estaba expandido para esa publicación, se cierra.
- Se muestra notificación toast de éxito.

---

## Datos de entrada

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|-------------|-------------|
| `id` | String (URL param) | Sí | Identificador de la publicación |

## Datos de salida

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `mensaje` | String | `"Publicación eliminada"` |

---

## Flujo principal

1. El usuario visualiza una publicación propia en el feed (botón **Eliminar** visible).
2. Pulsa **«Eliminar»**.
3. Aparece diálogo: *«¿Eliminar la publicación "…"? Esta acción no se puede deshacer.»*
4. El usuario confirma.
5. El frontend envía `DELETE /api/publicaciones/:id`.
6. El backend verifica que `publicacion.idAutor === req.usuario._id`.
7. Ejecuta `findByIdAndDelete`.
8. El frontend remueve la tarjeta del estado local.
9. Toast: *«Publicación eliminada.»*

---

## Flujos alternos

| ID | Condición | Acción del sistema |
|----|-----------|-------------------|
| FA-01 | Usuario cancela confirmación | No se ejecuta eliminación |
| FA-02 | Usuario no es el autor | HTTP 403: *«No autorizado para eliminar esta publicación»* |
| FA-03 | Publicación no encontrada | HTTP 404 |
| FA-04 | Botón no visible | Publicaciones ajenas no muestran opción eliminar |
| FA-05 | Error de servidor | Toast de error |

---

## Reglas de negocio

- RN-01: Solo el autor puede eliminar su publicación.
- RN-02: La eliminación es permanente (no hay papelera).
- RN-03: Al eliminar la publicación se eliminan también sus likes y comentarios embebidos.
- RN-04: Se requiere confirmación explícita del usuario.

---

## Casos de prueba sugeridos

| ID | Caso | Resultado esperado |
|----|------|-------------------|
| CP-01 | Autor elimina su publicación confirmando | Publicación desaparece del feed |
| CP-02 | Autor cancela confirmación | Publicación permanece |
| CP-03 | Usuario intenta eliminar publicación ajena | Botón no visible / 403 si forzado por API |
| CP-04 | Eliminar publicación inexistente | Error 404 |
| CP-05 | Eliminar y verificar en MongoDB | Documento no existe |

---

## Archivos relacionados

| Capa | Archivo |
|------|---------|
| Frontend | `src/pages/Feed.jsx` (componente `PostCard`, función `manejarEliminar`) |
| Frontend | `src/services/publicacionService.js` |
| Backend | `controllers/publicacionController.js` (función `eliminar`) |

---

*Formato F07 — UNAC Forum — Entrega Final*
