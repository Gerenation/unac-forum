# Formato de Funcionalidad F05 — Dar like a foros

| Campo | Valor |
|-------|-------|
| **Proyecto** | UNAC Forum |
| **Código** | F05 |
| **Nombre** | Dar like a foros |
| **Tipo** | Principal |
| **Módulo** | Foro / Interacción |
| **Prioridad** | Media |
| **Actor** | Usuario autenticado |

---

## Descripción

Permite al usuario expresar aprobación sobre una publicación mediante un botón de «me gusta». El like es persistente, se puede alternar (dar o quitar) y el contador se actualiza en tiempo real sin recargar la página.

---

## Precondiciones

- El usuario debe tener sesión activa.
- La publicación debe existir en la base de datos.
- El usuario no debe haber dado like previamente para agregar uno nuevo (o sí haberlo dado para quitarlo).

## Postcondiciones

- Si el usuario no había dado like: su ID se agrega a `idsUsuariosQueDieronLike` y el contador aumenta.
- Si el usuario ya había dado like: su ID se elimina del arreglo y el contador disminuye.
- La tarjeta de la publicación en el feed refleja el nuevo estado (`usuarioYaDioLike`, `cantidadLikes`).

---

## Datos de entrada

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|-------------|-------------|
| `id` | String (URL param) | Sí | Identificador de la publicación |

## Datos de salida

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `publicacion` | Object | Publicación actualizada con likes y estado del usuario |

---

## Flujo principal — Agregar like

1. El usuario visualiza una publicación en el feed.
2. Pulsa el botón **♥** (me gusta).
3. El frontend envía `POST /api/publicaciones/:id/like`.
4. El backend verifica que el usuario no esté en `idsUsuariosQueDieronLike`.
5. Ejecuta `$addToSet` para agregar el ID del usuario.
6. Devuelve la publicación actualizada.
7. El frontend reemplaza solo esa tarjeta en el estado local.
8. El botón cambia a estado activo (resaltado).

## Flujo principal — Quitar like

1. El usuario pulsa el botón **♥** en una publicación que ya tiene su like.
2. El backend ejecuta `$pull` para remover el ID del usuario.
3. El contador disminuye y el botón vuelve a estado inactivo.

---

## Flujos alternos

| ID | Condición | Acción del sistema |
|----|-----------|-------------------|
| FA-01 | Publicación no encontrada | HTTP 404 |
| FA-02 | Error de servidor | Toast de error |
| FA-03 | Sesión expirada | Redirección a login |
| FA-04 | Doble clic rápido | Cada petición alterna el estado correctamente |

---

## Reglas de negocio

- RN-01: Un usuario solo puede dar un like por publicación (sin duplicados).
- RN-02: El like es toggle: segunda pulsación lo elimina.
- RN-03: El contador refleja la longitud de `idsUsuariosQueDieronLike`.
- RN-04: Cualquier usuario autenticado puede dar like a cualquier publicación.

---

## Casos de prueba sugeridos

| ID | Caso | Resultado esperado |
|----|------|-------------------|
| CP-01 | Dar like a publicación sin likes previos | Contador = 1, botón activo |
| CP-02 | Quitar like propio | Contador disminuye, botón inactivo |
| CP-03 | Dos usuarios dan like a la misma publicación | Contador = 2 |
| CP-04 | Recargar página tras dar like | Estado de like persistido |
| CP-05 | Like en publicación inexistente | Error 404 |

---

## Archivos relacionados

| Capa | Archivo |
|------|---------|
| Frontend | `src/pages/Feed.jsx` (componente `PostCard`) |
| Frontend | `src/services/publicacionService.js` |
| Backend | `controllers/publicacionController.js` (función `toggleLike`) |
| Backend | `utils/serializers.js` |

---

*Formato F05 — UNAC Forum — Entrega Final*
