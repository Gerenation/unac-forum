# Formato de Funcionalidad F08 — Editar perfil de usuario

| Campo | Valor |
|-------|-------|
| **Proyecto** | UNAC Forum |
| **Código** | F08 |
| **Nombre** | Editar perfil de usuario |
| **Tipo** | Principal |
| **Módulo** | Usuario / Perfil |
| **Prioridad** | Media |
| **Actor** | Usuario autenticado |

---

## Descripción

Permite al usuario modificar su información personal registrada en el foro: nombre completo, nombre de usuario, correo electrónico y contraseña.

---

## Precondiciones

- El usuario debe tener sesión activa.
- Al menos un campo debe haber cambiado respecto al perfil actual.
- Si se cambia la contraseña: `contrasenaActual` es obligatoria y debe ser correcta.
- La nueva contraseña debe tener al menos 6 caracteres.
- Correo y nombre de usuario nuevos no deben estar en uso por otro usuario.

## Postcondiciones

- Los cambios quedan persistidos en la colección `usuarios`.
- El contexto de autenticación (`AuthContext`) se actualiza.
- El perfil en `localStorage` se refresca.
- El usuario es redirigido a `/explorar` con notificación de éxito.

---

## Datos de entrada

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|-------------|-------------|
| `nombreCompleto` | String | No | Nuevo nombre completo |
| `nombreUsuario` | String | No | Nuevo alias |
| `correo` | String | No | Nuevo correo |
| `contrasenaActual` | String | Condicional | Requerida si se cambia contraseña |
| `contrasenaNueva` | String | Condicional | Nueva contraseña (mín. 6) |

## Datos de salida

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `usuario` | Object | Perfil actualizado |

---

## Flujo principal

1. El usuario pulsa **«Mi perfil»** en el feed.
2. Accede a `/perfil` con los datos actuales precargados.
3. Modifica uno o más campos.
4. Si cambia contraseña, completa contraseña actual y nueva.
5. Pulsa **«Guardar cambios»**.
6. El frontend detecta solo los campos modificados.
7. Se envía `POST /api/auth/perfil` con los cambios.
8. El backend valida unicidad y contraseña actual (si aplica).
9. Se guarda el documento actualizado.
10. `refrescarUsuario()` actualiza el contexto.
11. Toast de éxito y redirección al feed.

---

## Flujos alternos

| ID | Condición | Acción del sistema |
|----|-----------|-------------------|
| FA-01 | Sin cambios | *«No hay cambios para guardar.»* |
| FA-02 | Contraseña actual incorrecta | *«Contraseña actual incorrecta»* (401) |
| FA-03 | Correo ya en uso | *«Ya existe un usuario con ese correo»* |
| FA-04 | Nombre de usuario duplicado | Error de unicidad |
| FA-05 | Nueva contraseña < 6 caracteres | Error de validación |
| FA-06 | Sin sesión | Redirección a `/login` |

---

## Reglas de negocio

- RN-01: Solo el propio usuario puede editar su perfil (vía token JWT).
- RN-02: La contraseña nueva se hashea en el servidor con bcrypt.
- RN-03: Si no se envía `contrasenaNueva`, la contraseña no cambia.
- RN-04: El correo se normaliza a minúsculas.

---

## Casos de prueba sugeridos

| ID | Caso | Resultado esperado |
|----|------|-------------------|
| CP-01 | Cambiar solo nombre completo | Perfil actualizado |
| CP-02 | Cambiar contraseña con actual correcta | Login funciona con nueva contraseña |
| CP-03 | Contraseña actual incorrecta | Error, sin cambios |
| CP-04 | Enviar formulario sin modificar nada | Error «No hay cambios» |
| CP-05 | Cambiar a correo ya registrado | Error de duplicado |

---

## Archivos relacionados

| Capa | Archivo |
|------|---------|
| Frontend | `src/pages/Perfil.jsx` |
| Frontend | `src/context/AuthContext.jsx` |
| Frontend | `src/services/authService.js` |
| Backend | `controllers/authController.js` (función `actualizarPerfil`) |
| Backend | `models/Usuario.js` |

---

*Formato F08 — UNAC Forum — Entrega Final*
