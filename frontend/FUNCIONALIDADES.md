# Funcionalidades del frontend — UNAC Forum (React)

Documentación de las funcionalidades implementadas en el cliente React, con precondiciones y postcondiciones para el informe del proyecto parcial.

---

## Funcionalidades principales

### 1. Manejo de sesión (login y logout)

| Aspecto | Detalle |
|---------|---------|
| **Archivos** | `src/context/AuthContext.jsx`, `src/pages/Login.jsx`, `src/services/authService.js`, `src/services/api.js` |
| **Precondición** | El usuario tiene cuenta registrada con correo y contraseña válidos (login). |
| **Postcondición** | El JWT se guarda en `localStorage`; al cerrar sesión se eliminan token y perfil. |
| **Flujo** | Login → token + usuario en contexto → rutas protegidas accesibles. Logout → redirección a `/login`. |

### 2. Registrar usuario

| Aspecto | Detalle |
|---------|---------|
| **Archivos** | `src/pages/Registro.jsx`, `src/context/AuthContext.jsx`, `src/services/authService.js` |
| **Precondición** | Correo y nombre de usuario no existen en la base de datos; contraseña ≥ 6 caracteres y confirmación coincide. |
| **Postcondición** | Usuario creado en MongoDB, sesión iniciada automáticamente y redirección al feed. |

### 3. Filtrar foros (publicaciones)

| Aspecto | Detalle |
|---------|---------|
| **Archivos** | `src/pages/Feed.jsx`, `src/services/publicacionService.js` |
| **Precondición** | Usuario autenticado. |
| **Postcondición** | El feed muestra solo publicaciones que coinciden con texto (`q`) y/o categoría seleccionada. |
| **Detalle** | Búsqueda en título, contenido y autor; filtro por una categoría (incluye publicaciones multi-categoría). |

### 4. Crear foros (publicaciones)

| Aspecto | Detalle |
|---------|---------|
| **Archivos** | `src/pages/NuevaPublicacion.jsx`, `src/services/publicacionService.js` |
| **Precondición** | Título y contenido no vacíos; al menos 1 categoría y máximo 5. |
| **Postcondición** | Publicación persistida en MongoDB y visible en el feed. |

### 5. Dar like a foros

| Aspecto | Detalle |
|---------|---------|
| **Archivos** | `src/pages/Feed.jsx` (componente `PostCard`), `src/services/publicacionService.js` |
| **Precondición** | Usuario autenticado; la publicación existe. |
| **Postcondición** | El like se alterna (agregar/quitar); el contador se actualiza sin recargar la página. |

### 6. Comentar foro

| Aspecto | Detalle |
|---------|---------|
| **Archivos** | `src/pages/Feed.jsx` (sección de comentarios en `PostCard`) |
| **Precondición** | Texto del comentario no vacío y ≤ 500 caracteres. |
| **Postcondición** | Comentario asociado a la publicación con autor y fecha. |

### 7. Eliminar foro

| Aspecto | Detalle |
|---------|---------|
| **Archivos** | `src/pages/Feed.jsx` |
| **Precondición** | El usuario en sesión es el autor de la publicación; confirma en el diálogo. |
| **Postcondición** | La publicación desaparece del feed y de la base de datos. |

### 8. Editar perfil de usuario

| Aspecto | Detalle |
|---------|---------|
| **Archivos** | `src/pages/Perfil.jsx`, `src/services/authService.js` |
| **Precondición** | Sesión activa; si cambia contraseña, la actual debe ser correcta. |
| **Postcondición** | Perfil actualizado en servidor y en `AuthContext` / `localStorage`. |

---

## Funcionalidades secundarias

### 9. Protección de rutas

| Aspecto | Detalle |
|---------|---------|
| **Archivos** | `src/components/auth/ProtectedRoute.jsx`, `src/app/App.jsx` |
| **Precondición** | El usuario intenta acceder a `/explorar`, `/nueva-publicacion` o `/perfil`. |
| **Postcondición** | Sin sesión → redirección a `/login`; con sesión → se muestra la página. |

### 10. Persistencia y validación de token al recargar

| Aspecto | Detalle |
|---------|---------|
| **Archivos** | `src/context/AuthContext.jsx`, `src/services/api.js` |
| **Precondición** | Existe `unac_forum_token` en `localStorage` al abrir la app. |
| **Postcondición** | Si el token es válido, la sesión se restaura; si no, se limpia y pide login. |

### 11. Landing page pública

| Aspecto | Detalle |
|---------|---------|
| **Archivos** | `src/pages/Landing.jsx` |
| **Precondición** | Ninguna (ruta `/`). |
| **Postcondición** | El usuario puede ir al login con el botón «Entrar al foro». |

### 12. Multi-categoría en publicaciones

| Aspecto | Detalle |
|---------|---------|
| **Archivos** | `src/pages/NuevaPublicacion.jsx`, `src/pages/Feed.jsx`, `src/constants/categorias.js` |
| **Precondición** | Entre 1 y 5 categorías válidas al crear; filtro por una categoría en el feed. |
| **Postcondición** | Cada publicación muestra varios chips de categoría según la intención del autor. |

### 13. Notificaciones toast

| Aspecto | Detalle |
|---------|---------|
| **Archivos** | `src/app/App.jsx`, páginas que usan `react-hot-toast` |
| **Precondición** | Acción completada o error en operación del foro. |
| **Postcondición** | Mensaje breve visible al usuario (éxito o error). |

### 14. Marca visual con logo UNAC en cabeceras

| Aspecto | Detalle |
|---------|---------|
| **Archivos** | `src/components/layout/SiteBrand.jsx`, `src/components/layout/Header.jsx`, `src/assets/logo.svg` |
| **Precondición** | Asset `logo.svg` disponible en el frontend. |
| **Postcondición** | Logo visible en header de feed, perfil, login, registro y landing. |

---

## Resumen numérico

| Tipo | Cantidad |
|------|----------|
| Principales | 8 |
| Secundarias | 6 |
| **Total documentadas** | **14** |

Cumple el requisito mínimo de **10 funcionalidades** para documentación del proyecto.

---

## Credenciales de prueba

| Correo | Contraseña |
|--------|------------|
| `pepito.perez@estudiantes.unac.edu` | `demo123` |
| `fulano.de.tal@estudiantes.unac.edu` | `demo123` |
