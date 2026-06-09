# Formato de Funcionalidad F09 — Protección de rutas

| Campo | Valor |
|-------|-------|
| **Proyecto** | UNAC Forum |
| **Código** | F09 |
| **Nombre** | Protección de rutas |
| **Tipo** | Secundaria |
| **Módulo** | Seguridad / Navegación |
| **Prioridad** | Alta |
| **Actor** | Sistema / Usuario (autenticado o no) |

---

## Descripción

Restringe el acceso a las páginas privadas del foro (feed, nueva publicación y perfil), permitiendo su visualización solo a usuarios con sesión activa. Los visitantes sin sesión son redirigidos al inicio de sesión.

---

## Precondiciones

- El componente `ProtectedRoute` debe envolver las rutas privadas en `App.jsx`.
- `AuthProvider` debe haber finalizado la verificación inicial de sesión (`cargando === false`).

## Postcondiciones

- **Con sesión:** se renderiza la página solicitada.
- **Sin sesión:** redirección a `/login` con `replace`.
- **Durante carga:** se muestra mensaje *«Verificando sesión…»*.

---

## Datos de entrada

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `estaAutenticado` | Boolean | Estado del contexto de auth |
| `cargando` | Boolean | Si la sesión aún se está validando |
| `children` | ReactNode | Página protegida a renderizar |

## Datos de salida

| Resultado | Descripción |
|-----------|-------------|
| Página protegida | Componente hijo renderizado |
| `<Navigate to="/login">` | Redirección si no hay sesión |
| Indicador de carga | Mientras `cargando === true` |

---

## Rutas protegidas

| Ruta | Componente |
|------|------------|
| `/explorar` | `Feed` |
| `/nueva-publicacion` | `NuevaPublicacion` |
| `/perfil` | `Perfil` |

## Rutas públicas

| Ruta | Componente |
|------|------------|
| `/` | `Landing` |
| `/login` | `Login` |
| `/registro` | `Registro` |

---

## Flujo principal

1. El usuario intenta acceder a una ruta protegida (ej. `/explorar`).
2. `ProtectedRoute` consulta `useAuth()`.
3. Si `cargando === true`, muestra indicador de verificación.
4. Si `estaAutenticado === false`, renderiza `<Navigate to="/login" />`.
5. Si `estaAutenticado === true`, renderiza la página solicitada.

---

## Flujos alternos

| ID | Condición | Acción del sistema |
|----|-----------|-------------------|
| FA-01 | Token inválido al cargar app | `AuthContext` limpia sesión → `estaAutenticado = false` |
| FA-02 | 401 en petición API | Interceptor redirige a `/login` |
| FA-03 | Usuario autenticado visita `/login` | `Login.jsx` redirige a `/explorar` |
| FA-04 | Ruta inexistente (`*`) | Redirige a `/` (Landing) |

---

## Reglas de negocio

- RN-01: La protección es en el cliente; el backend también valida JWT en cada endpoint.
- RN-02: No se puede acceder al feed sin token válido.
- RN-03: La redirección usa `replace` para no acumular historial de rutas bloqueadas.
- RN-04: La verificación de sesión ocurre antes de mostrar contenido privado.

---

## Casos de prueba sugeridos

| ID | Caso | Resultado esperado |
|----|------|-------------------|
| CP-01 | Acceder a `/explorar` sin sesión | Redirección a `/login` |
| CP-02 | Acceder a `/explorar` con sesión | Feed visible |
| CP-03 | Acceder a `/perfil` sin sesión | Redirección a `/login` |
| CP-04 | Acceder a `/` sin sesión | Landing visible |
| CP-05 | Cerrar sesión estando en `/explorar` | Redirección a `/login` |

---

## Archivos relacionados

| Capa | Archivo |
|------|---------|
| Frontend | `src/components/auth/ProtectedRoute.jsx` |
| Frontend | `src/app/App.jsx` |
| Frontend | `src/context/AuthContext.jsx` |
| Backend | `middleware/auth.js` |

---

*Formato F09 — UNAC Forum — Entrega Final*
