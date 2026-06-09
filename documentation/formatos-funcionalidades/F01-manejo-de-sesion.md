# Formato de Funcionalidad F01 — Manejo de sesión (login y logout)

| Campo | Valor |
|-------|-------|
| **Proyecto** | UNAC Forum |
| **Código** | F01 |
| **Nombre** | Manejo de sesión (login y logout) |
| **Tipo** | Principal |
| **Módulo** | Autenticación |
| **Prioridad** | Alta |
| **Actor** | Usuario registrado / visitante con cuenta |

---

## Descripción

Permite al usuario autenticarse en el foro mediante correo y contraseña, mantener la sesión activa con un token JWT almacenado en el navegador, y cerrar sesión de forma segura eliminando las credenciales locales.

---

## Precondiciones

- El usuario debe tener una cuenta previamente registrada en el sistema.
- El backend y la base de datos MongoDB deben estar en ejecución.
- Para el login: correo y contraseña deben ser válidos y coincidir con un registro existente.
- Para el logout: debe existir una sesión activa en el cliente.

## Postcondiciones

- **Login exitoso:** el token JWT y el perfil público del usuario quedan guardados en `localStorage`; el usuario puede acceder a rutas protegidas.
- **Logout exitoso:** se eliminan `unac_forum_token` y `unac_forum_usuario` de `localStorage`; el usuario es redirigido a `/login`.
- **Login fallido:** no se almacena sesión; se muestra mensaje de error.

---

## Datos de entrada

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|-------------|-------------|
| `correo` | String (email) | Sí | Correo registrado del usuario |
| `contrasena` | String | Sí | Contraseña de la cuenta (mín. 6 caracteres) |

## Datos de salida

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `token` | String (JWT) | Token de sesión válido por 30 días |
| `usuario` | Object | `{ id, nombreCompleto, nombreUsuario, correo }` |

---

## Flujo principal — Iniciar sesión

1. El usuario accede a `/login`.
2. Ingresa correo y contraseña.
3. Pulsa **«Entrar al foro»**.
4. El frontend envía `POST /api/auth/login`.
5. El backend valida credenciales y devuelve token + usuario.
6. El frontend guarda la sesión en `localStorage` y actualiza `AuthContext`.
7. El usuario es redirigido a `/explorar`.

## Flujo principal — Cerrar sesión

1. El usuario pulsa **«Cerrar sesión»** en la cabecera.
2. El frontend ejecuta `logout()` del contexto de autenticación.
3. Se eliminan token y perfil de `localStorage`.
4. El usuario es redirigido a `/login`.

---

## Flujos alternos

| ID | Condición | Acción del sistema |
|----|-----------|-------------------|
| FA-01 | Campos vacíos en login | Muestra: *«Ingresa tu correo y contraseña.»* |
| FA-02 | Credenciales incorrectas | Muestra: *«Credenciales inválidas»* (HTTP 401) |
| FA-03 | Usuario ya autenticado visita `/login` | Redirige automáticamente a `/explorar` |
| FA-04 | Token expirado o inválido (HTTP 401) | Interceptor limpia sesión y redirige a `/login` |
| FA-05 | Recarga de página con token válido | `AuthProvider` valida con `GET /api/auth/perfil` y restaura sesión |

---

## Reglas de negocio

- RN-01: La contraseña nunca se almacena en texto plano en el cliente.
- RN-02: El token JWT expira a los 30 días.
- RN-03: Todas las rutas de publicaciones requieren sesión activa.
- RN-04: Ante un error 401, la sesión local se invalida automáticamente.

---

## Casos de prueba sugeridos

| ID | Caso | Resultado esperado |
|----|------|-------------------|
| CP-01 | Login con credenciales demo válidas | Acceso al feed |
| CP-02 | Login con contraseña incorrecta | Mensaje de error, sin sesión |
| CP-03 | Cerrar sesión desde el feed | Redirección a login, sin token en storage |
| CP-04 | Recargar página con sesión activa | Feed visible sin volver a loguearse |
| CP-05 | Acceder a `/explorar` sin sesión | Redirección a `/login` |

---

## Archivos relacionados

| Capa | Archivo |
|------|---------|
| Frontend | `src/pages/Login.jsx` |
| Frontend | `src/context/AuthContext.jsx` |
| Frontend | `src/services/authService.js` |
| Frontend | `src/services/api.js` |
| Frontend | `src/components/layout/Header.jsx` |
| Backend | `controllers/authController.js` |
| Backend | `middleware/auth.js` |

---

*Formato F01 — UNAC Forum — Entrega Final*
