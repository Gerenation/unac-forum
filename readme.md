# Parcial Programación Web — UNAC Forum

> Foro web dinámico para estudiantes de la UNAC, construido con **React + Vite** (frontend) y **Node.js + Express + MongoDB** (backend). Autenticación real con JWT, persistencia en MongoDB, publicaciones con **múltiples categorías**, comentarios, likes, perfil editable y datos de demostración sembrados al arrancar.

---

## Tabla de contenidos

1. [Stack y características](#1-stack-y-características)
2. [Funcionalidades del proyecto](#2-funcionalidades-del-proyecto)
3. [Cómo correr el proyecto](#3-cómo-correr-el-proyecto)
4. [Estructura del proyecto](#4-estructura-del-proyecto)
5. [Base de datos MongoDB](#5-base-de-datos-mongodb)
6. [API REST — endpoints](#6-api-rest--endpoints)
7. [Flujo de la aplicación](#7-flujo-de-la-aplicación)
8. [Documentación por archivo](#8-documentación-por-archivo)
9. [Equipo](#9-equipo)
10. [Notas de desarrollo](#10-notas-de-desarrollo)

---

## 1. Stack y características

### Stack

| Capa | Tecnología |
|---|---|
| Frontend | React 18, Vite 5, react-router-dom v6, axios, react-hot-toast |
| Backend | Node.js, Express 4, Mongoose 8, JWT, bcryptjs, CORS, dotenv |
| Base de datos | MongoDB (local en `mongodb://127.0.0.1:27017/unac_forum`) |
| Lanzador | `run_project.bat` (Windows) |

### Características principales

- **Autenticación real** con JWT (30 días) y contraseñas hasheadas (bcrypt, 10 salt rounds).
- **Registro e inicio de sesión** con persistencia de sesión en `localStorage`.
- **Landing page** pública con ilustración (`Friends.png`) y fondo del campus (`Fondo.png`).
- **Logo UNAC** en todas las cabeceras del sitio (`SiteBrand` + `logo.svg`).
- **Feed** de publicaciones ordenadas de la más reciente a la más antigua.
- **Búsqueda por texto** en título, contenido y autor (case-insensitive).
- **Filtro por categoría** (9 categorías; incluye publicaciones multi-categoría).
- **Crear publicación** con **1 a 5 categorías** simultáneas.
- **Likes persistentes** con toggle por usuario y conteo en tiempo real.
- **Comentarios** en publicaciones (máx. 500 caracteres).
- **Eliminar publicación** (solo el autor).
- **Editar perfil** (nombre, usuario, correo y contraseña).
- **Protección de rutas** para `/explorar`, `/nueva-publicacion` y `/perfil`.
- **Notificaciones toast** con `react-hot-toast`.
- **Código documentado** con comentarios JSDoc (`@param`, `@returns`, precondiciones y postcondiciones).
- **Responsive** con flexbox y grid.
- **Datos demo** sembrados automáticamente al primer arranque.
- **Migración automática** de publicaciones antiguas con campo único `categoria` → arreglo `categorias`.

---

## 2. Funcionalidades del proyecto

El proyecto documenta **14 funcionalidades** (8 principales + 6 secundarias). Detalle ampliado en [`frontend/FUNCIONALIDADES.md`](frontend/FUNCIONALIDADES.md).

### Funcionalidades principales

| # | Funcionalidad | Archivos clave |
|---|---|---|
| 1 | **Manejo de sesión** (login, logout, JWT) | `AuthContext.jsx`, `Login.jsx`, `authService.js`, `api.js` |
| 2 | **Registrar usuario** | `Registro.jsx`, `AuthContext.jsx` |
| 3 | **Filtrar foros** (búsqueda + categoría) | `Feed.jsx`, `publicacionService.js` |
| 4 | **Crear foros** (publicaciones multi-categoría) | `NuevaPublicacion.jsx` |
| 5 | **Dar like a foros** | `Feed.jsx` → `PostCard` |
| 6 | **Comentar foro** | `Feed.jsx` → sección de comentarios |
| 7 | **Eliminar foro** (solo autor) | `Feed.jsx` |
| 8 | **Editar perfil de usuario** | `Perfil.jsx`, `authService.js` |

### Funcionalidades secundarias

| # | Funcionalidad | Archivos clave |
|---|---|---|
| 9 | Protección de rutas | `ProtectedRoute.jsx`, `App.jsx` |
| 10 | Persistencia y validación de token al recargar | `AuthContext.jsx`, `api.js` |
| 11 | Landing page pública | `Landing.jsx` |
| 12 | Multi-categoría en publicaciones (1–5) | `NuevaPublicacion.jsx`, `Feed.jsx`, `categorias.js` |
| 13 | Notificaciones toast | `App.jsx`, páginas con `react-hot-toast` |
| 14 | Logo UNAC en cabeceras | `SiteBrand.jsx`, `Header.jsx`, `assets/logo.svg` |

### Precondiciones y postcondiciones (resumen)

Cada función del frontend y los servicios HTTP incluyen comentarios JSDoc con:

- **Precondición**: qué debe cumplirse antes de ejecutar la acción.
- **Postcondición**: qué queda garantizado tras ejecutarla correctamente.
- **`@param`**: descripción de cada parámetro de entrada.
- **`@returns`**: descripción del valor de retorno.

Ejemplo en `src/services/authService.js`:

```javascript
/**
 * Inicia sesión con correo y contraseña.
 * Precondición: el usuario ya existe y las credenciales son correctas.
 * Postcondición: retorna token JWT válido por 30 días y datos públicos del usuario.
 * @param {Object} credenciales - Par correo/contraseña del formulario de login.
 * @returns {Promise<{token: string, usuario: Object}>} Sesión autenticada.
 */
```

---

## 3. Cómo correr el proyecto

### Prerrequisitos

- **Node.js 18+** y **npm** en el PATH.
- **MongoDB** corriendo en `127.0.0.1:27017` (servicio Windows o `mongod` local).

### Opción A — Lanzador automático (Windows)

Doble clic en `run_project.bat`. El script:

1. Verifica `node` y `npm`.
2. Intenta arrancar el servicio MongoDB.
3. Instala dependencias en `backend/` y `frontend/` si hace falta.
4. Copia `backend/.env.example` → `backend/.env` si no existe.
5. Abre dos ventanas: **UNAC Forum Backend** y **UNAC Forum Frontend**.
6. El navegador se abre en `http://localhost:5173/`.

### Opción B — Dos terminales manuales

**Terminal 1 (backend)**:

```bash
cd backend
npm install
npm run dev
```

→ Levanta en `http://localhost:5001`, conecta MongoDB, migra categorías legacy y siembra datos si la BD está vacía.

**Terminal 2 (frontend)**:

```bash
cd frontend
npm install
npm run dev
```

→ Levanta Vite en `http://localhost:5173` con proxy `/api` → `:5001`.

### Build de producción (frontend)

```bash
cd frontend
npm run build
npm run preview
```

### Credenciales de demostración

| Correo | Contraseña |
|---|---|
| `pepito.perez@estudiantes.unac.edu` | `demo123` |
| `fulano.de.tal@estudiantes.unac.edu` | `demo123` |

---

## 4. Estructura del proyecto

```
unac-forum-actualizado/
├── resources/
│   └── logo.svg                    # Logo fuente (copiado a frontend/src/assets/)
└── unac-forum/
    ├── run_project.bat
    ├── readme.md
    │
    ├── backend/                    # API REST
    │   ├── server.js               # Entrada: DB + seed + listen
    │   ├── app.js                  # Express + rutas + errores
    │   ├── .env.example
    │   ├── config/database.js
    │   ├── controllers/
    │   │   ├── authController.js
    │   │   └── publicacionController.js
    │   ├── middleware/auth.js
    │   ├── models/
    │   │   ├── Usuario.js
    │   │   └── Publicacion.js
    │   ├── routes/
    │   │   ├── authRoutes.js
    │   │   └── publicacionRoutes.js
    │   ├── services/seedService.js
    │   └── utils/
    │       ├── seedData.js
    │       └── serializers.js
    │
    └── frontend/                   # SPA React
        ├── FUNCIONALIDADES.md      # Documentación de las 14 funcionalidades
        ├── vite.config.js
        ├── index.html
        └── src/
            ├── main.jsx
            ├── app/App.jsx
            ├── assets/
            │   ├── logo.svg        # Logo en cabeceras
            │   ├── Fondo.png       # Fondo landing
            │   └── Friends.png     # Ilustración hero landing
            ├── components/
            │   ├── auth/ProtectedRoute.jsx
            │   ├── layout/
            │   │   ├── Header.jsx
            │   │   ├── SiteBrand.jsx
            │   │   └── Footer.jsx
            │   └── ui/Message.jsx, Field.jsx
            ├── context/AuthContext.jsx
            ├── pages/
            │   ├── Landing.jsx
            │   ├── Login.jsx
            │   ├── Registro.jsx
            │   ├── Feed.jsx
            │   ├── NuevaPublicacion.jsx
            │   └── Perfil.jsx
            ├── services/
            │   ├── api.js
            │   ├── authService.js
            │   └── publicacionService.js
            ├── constants/categorias.js
            └── styles/
                ├── global.css
                ├── auth.css
                ├── feed.css
                ├── formularioPost.css
                └── landing.css
```

---

## 5. Base de datos MongoDB

### Conexión

- **Driver**: Mongoose 8.
- **URI por defecto**: `mongodb://127.0.0.1:27017/unac_forum`.
- **Configurable** vía `MONGODB_URI` en `backend/.env`.
- **Conexión** en `backend/config/database.js` (`conectarDB()`).

### Colección `usuarios`

| Campo | Tipo | Restricciones |
|---|---|---|
| `nombreCompleto` | String | requerido, trim, mín. 2 |
| `nombreUsuario` | String | requerido, trim, mín. 2 |
| `correo` | String | requerido, lowercase, regex email |
| `contrasena` | String | requerido, mín. 6, `select: false` |
| `createdAt` / `updatedAt` | Date | timestamps automáticos |

- Contraseñas hasheadas con **bcrypt** (10 salt rounds) en hook `pre('save')`.
- Unicidad de correo y nombre de usuario validada en el controlador.
- Índices con colación `{ locale: 'es', strength: 2 }`.

### Colección `publicaciones`

| Campo | Tipo | Restricciones |
|---|---|---|
| `titulo` | String | requerido, trim, máx. 60 |
| `contenido` | String | requerido, trim |
| `categorias` | String[] | requerido, enum (9 valores), mín. 1, máx. 5 |
| `idAutor` | ObjectId | ref `Usuario`, requerido |
| `nombreAutor` | String | requerido (desnormalizado) |
| `fechaIso` | Date | default `Date.now` |
| `idsUsuariosQueDieronLike` | ObjectId[] | ref `Usuario` |
| `comentarios` | Subdocumento[] | ver abajo |
| `createdAt` / `updatedAt` | Date | timestamps automáticos |

**Subdocumento `comentarios`:**

| Campo | Tipo | Restricciones |
|---|---|---|
| `idAutor` | ObjectId | ref `Usuario` |
| `nombreAutor` | String | requerido |
| `texto` | String | requerido, máx. 500 |
| `fechaIso` | Date | default `Date.now` |

### Categorías válidas (enum)

`convocatoria`, `evento`, `alertaAcademica`, `bienestar`, `tecnologia`, `deportes`, `cultura`, `general`, `socializacion`.

Definidas en:

- `backend/models/Publicacion.js`
- `backend/utils/seedData.js`
- `frontend/src/constants/categorias.js`

### Siembra automática (seed)

`backend/services/seedService.js` ejecuta al arrancar el backend:

1. **`migrarCategoriasLegacy()`** — convierte publicaciones antiguas con campo `categoria` (string) al nuevo arreglo `categorias`.
2. **`sembrarSiVacio()`** — si las colecciones están vacías, inserta 2 usuarios demo y 3 publicaciones con varias categorías cada una.

### Datos de demostración

**Usuarios** (`USUARIOS_DUMMY`):

| nombreCompleto | nombreUsuario | correo | contraseña |
|---|---|---|---|
| Pepito Pérez | `pepitoPerez` | `pepito.perez@estudiantes.unac.edu` | `demo123` |
| Fulano de Tal | `ThefulanoDeTal` | `fulano.de.tal@estudiantes.unac.edu` | `demo123` |

**Publicaciones** (`PUBLICACIONES_INICIALES`):

| Título | Categorías | Autor |
|---|---|---|
| Club de lectura: ciencia ficción latinoamericana | `cultura`, `evento`, `socializacion` | Pepito Pérez |
| Taller de bienestar emocional (gratuito) | `bienestar`, `alertaAcademica` | Fulano de Tal |
| Sale parche al cerro de las 3 cruces | `socializacion`, `deportes`, `evento` | Pepito Pérez |

### Operaciones útiles con `mongosh`

```bash
mongosh "mongodb://127.0.0.1:27017/unac_forum"

db.usuarios.find({}, { contrasena: 0 })
db.publicaciones.find().sort({ fechaIso: -1 })

# Borrar todo (forzar re-siembra al próximo arranque)
db.dropDatabase()
```

---

## 6. API REST — endpoints

### Raíz

| Método | Ruta | Auth | Respuesta |
|---|---|---|---|
| GET | `/` | — | `{ mensaje, version: "1.0.0" }` |

### Autenticación (`/api/auth`)

| Método | Ruta | Auth | Body | Respuesta |
|---|---|---|---|---|
| POST | `/api/auth/registro` | — | `{ nombreCompleto, nombreUsuario, correo, contrasena }` | `{ token, usuario }` (201) |
| POST | `/api/auth/login` | — | `{ correo, contrasena }` | `{ token, usuario }` |
| GET | `/api/auth/perfil` | ✅ Bearer | — | `{ usuario }` |
| POST | `/api/auth/perfil` | ✅ Bearer | `{ nombreCompleto?, nombreUsuario?, correo?, contrasenaActual?, contrasenaNueva? }` | `{ usuario }` |

### Publicaciones (`/api/publicaciones`)

Todas requieren `Authorization: Bearer <token>`.

| Método | Ruta | Query / Body | Respuesta |
|---|---|---|---|
| GET | `/api/publicaciones` | `?q=texto&categoria=valor` | `{ publicaciones: [...] }` |
| POST | `/api/publicaciones` | `{ titulo, contenido, categorias: string[] }` | `{ publicacion }` (201) |
| POST | `/api/publicaciones/:id/like` | — | `{ publicacion }` (toggle like) |
| POST | `/api/publicaciones/:id/comentarios` | `{ texto }` | `{ publicacion }` (201) |
| DELETE | `/api/publicaciones/:id` | — | `{ mensaje: "Publicación eliminada" }` (403 si no es autor) |

> **Compatibilidad:** el body de creación también acepta `categoria` (string) por compatibilidad; se convierte internamente a `categorias[]`.

### Formato del objeto `usuario`

```json
{
  "id": "6a1f1edb94b30782578e961a",
  "nombreCompleto": "Pepito Pérez",
  "nombreUsuario": "pepitoPerez",
  "correo": "pepito.perez@estudiantes.unac.edu"
}
```

### Formato del objeto `publicacion`

```json
{
  "id": "6a1f1fed94034f11fe98a1d9",
  "titulo": "Club de lectura: ciencia ficción latinoamericana",
  "contenido": "Se abre inscripción para el círculo de lectura del mes...",
  "categorias": ["cultura", "evento", "socializacion"],
  "categoria": "cultura",
  "idAutor": "6a1f1edb94b30782578e961a",
  "nombreAutor": "Pepito Pérez",
  "fechaIso": "2026-04-01T15:00:00.000Z",
  "likes": ["6a1f1edb94b30782578e961b"],
  "cantidadLikes": 1,
  "usuarioYaDioLike": false,
  "comentarios": [
    {
      "idAutor": "...",
      "nombreAutor": "Fulano de Tal",
      "texto": "¡Me apunto!",
      "fechaIso": "2026-04-02T10:00:00.000Z"
    }
  ],
  "cantidadComentarios": 1
}
```

> El campo `categoria` en la respuesta es la primera categoría del arreglo (compatibilidad con clientes antiguos).

### Autenticación JWT

```
Authorization: Bearer <token>
```

- Firmado con `JWT_SECRET` (en `backend/.env`).
- Expiración: **30 días**.
- Payload: `{ id: usuarioId }`.

### Variables de entorno (`backend/.env.example`)

| Variable | Valor por defecto | Uso |
|---|---|---|
| `PORT` | `5001` | Puerto HTTP del servidor |
| `MONGODB_URI` | `mongodb://127.0.0.1:27017/unac_forum` | Conexión MongoDB |
| `JWT_SECRET` | cadena de ejemplo | Firma JWT (cambiar en producción) |

---

## 7. Flujo de la aplicación

### Rutas del frontend

| Ruta | Página | Protegida |
|---|---|---|
| `/` | Landing | No |
| `/login` | Login | No |
| `/registro` | Registro | No |
| `/explorar` | Feed | Sí |
| `/nueva-publicacion` | Nueva publicación | Sí |
| `/perfil` | Editar perfil | Sí |
| `*` | Redirige a `/` | — |

### Flujo típico

1. **Landing** (`/`) → el usuario pulsa «Entrar al foro» → `/login`.
2. **Login** → `POST /api/auth/login` → JWT en `localStorage` → `/explorar`.
3. **AuthProvider** al cargar valida el token con `GET /api/auth/perfil`.
4. **Feed** → `GET /api/publicaciones?q=&categoria=` → tarjetas con chips multi-categoría.
5. **Like** → `POST /api/publicaciones/:id/like` → actualiza solo esa tarjeta.
6. **Comentario** → `POST /api/publicaciones/:id/comentarios` → panel expandido actualizado.
7. **Nueva publicación** → checkboxes de categorías (1–5) → `POST /api/publicaciones` → `/explorar`.
8. **Eliminar** → confirmación → `DELETE /api/publicaciones/:id` (solo autor).
9. **Perfil** → `POST /api/auth/perfil` → refresca contexto → `/explorar`.
10. **Logout** → limpia `localStorage` → `/login`.
11. **401** en cualquier petición → interceptor limpia sesión → `/login`.

### Almacenamiento local (`localStorage`)

| Clave | Contenido |
|---|---|
| `unac_forum_token` | JWT de sesión |
| `unac_forum_usuario` | JSON del perfil público |

---

## 8. Documentación por archivo

### 8.1 Raíz

| Archivo | Descripción |
|---|---|
| `run_project.bat` | Lanzador Windows: Node, MongoDB, deps, `.env`, backend + frontend. |
| `readme.md` | Este documento. |

### 8.2 Backend

| Archivo | Descripción |
|---|---|
| `server.js` | Entrada: `.env` → `conectarDB()` → `sembrarSiVacio()` → `listen(PORT)`. |
| `app.js` | Express: CORS, JSON 8MB, rutas `/api/auth` y `/api/publicaciones`, 404/500. |
| `config/database.js` | `conectarDB()` con `MONGODB_URI`. |
| `models/Usuario.js` | Esquema usuario + bcrypt hook + `compararContrasena()`. |
| `models/Publicacion.js` | Esquema con `categorias[]`, comentarios, likes. Exporta `CATEGORIAS` y `MAX_CATEGORIAS_POR_PUBLICACION`. |
| `middleware/auth.js` | `autenticar`: verifica JWT, carga `req.usuario`. |
| `controllers/authController.js` | `registrar`, `login`, `obtenerPerfil`, `actualizarPerfil`. |
| `controllers/publicacionController.js` | `listar`, `crear`, `toggleLike`, `eliminar`, `agregarComentario`. |
| `routes/authRoutes.js` | Rutas de autenticación y perfil. |
| `routes/publicacionRoutes.js` | Rutas de publicaciones (todas autenticadas). |
| `services/seedService.js` | `migrarCategoriasLegacy()` + `sembrarSiVacio()`. |
| `utils/seedData.js` | Usuarios y publicaciones demo con multi-categoría. |
| `utils/serializers.js` | `usuarioPublico()`, `publicacionPublico()`, `extraerCategorias()`. |

### 8.3 Frontend

| Archivo | Descripción |
|---|---|
| `FUNCIONALIDADES.md` | Las 14 funcionalidades con pre/postcondiciones para el informe. |
| `main.jsx` | Entrada React: CSS globales + `<App />` en StrictMode. |
| `app/App.jsx` | Router, AuthProvider, Toaster, rutas públicas y protegidas. |
| `context/AuthContext.jsx` | Sesión global: login, registro, logout, refrescarUsuario. |
| `components/auth/ProtectedRoute.jsx` | Guard de rutas → `/login` si no hay sesión. |
| `components/layout/SiteBrand.jsx` | Logo UNAC + título + subtítulo (cabeceras). |
| `components/layout/Header.jsx` | Cabecera autenticada con nav, saludo y cerrar sesión. |
| `components/layout/Footer.jsx` | Pie de página en vistas del foro. |
| `components/ui/Message.jsx` | Mensajes de error/éxito en formularios. |
| `pages/Landing.jsx` | Bienvenida pública; fondo `Fondo.png`, hero `Friends.png`, logo en header. |
| `pages/Login.jsx` | Inicio de sesión; redirige a `/explorar` si ya hay sesión. |
| `pages/Registro.jsx` | Alta de usuario con validación local. |
| `pages/Feed.jsx` | Feed, búsqueda, filtro, likes, comentarios, eliminar. |
| `pages/NuevaPublicacion.jsx` | Formulario con grilla de checkboxes multi-categoría. |
| `pages/Perfil.jsx` | Edición de datos personales y contraseña. |
| `services/api.js` | Axios + interceptores JWT y manejo de 401. |
| `services/authService.js` | Wrappers `/auth/*` con JSDoc. |
| `services/publicacionService.js` | Wrappers `/publicaciones/*` con JSDoc. |
| `constants/categorias.js` | Enum, etiquetas, `normalizarCategorias()`, fechas `es-CO`. |
| `styles/*.css` | Tema oscuro, feed, auth, formularios, landing. |

---

## 9. Equipo

- Daniel Santiago Rodríguez Gerena
- Abdiel Esteban Amorocho de Sousa
- Juan José Oquendo Jaramillo
- Karol Dayana Pinto Hortua

---

## 10. Notas de desarrollo

### Desarrollo local

- **HMR de Vite**: cambios en CSS y componentes se aplican al instante.
- **nodemon**: el backend se recarga automáticamente al editar archivos.
- **Proxy**: en desarrollo, `/api` del frontend apunta a `http://localhost:5001`.

### Sesión y seguridad

- El JWT en `localStorage` mantiene la sesión activa hasta 30 días o hasta logout/401.
- Cambiar `JWT_SECRET` en producción (`backend/.env`, no commitear).
- Las contraseñas nunca se devuelven en las respuestas de la API.

### Base de datos

- Limpiar y re-sembrar: `mongosh` → `use unac_forum` → `db.dropDatabase()` → reiniciar backend.
- La migración de `categoria` → `categorias` corre en cada arranque del backend.

### Assets visuales

| Archivo | Ubicación | Uso |
|---|---|---|
| `logo.svg` | `frontend/src/assets/` (origen: `resources/logo.svg`) | Cabeceras (`SiteBrand`) |
| `Fondo.png` | `frontend/src/assets/` | Fondo de la landing |
| `Friends.png` | `frontend/src/assets/` | Ilustración hero de la landing |

### Dependencias declaradas sin uso actual en `src/`

- `framer-motion` y `lucide-react` están en `package.json` pero no se importan aún.

### Posibles mejoras futuras

- Paginación del feed.
- Imágenes adjuntas en publicaciones.
- Notificaciones en tiempo real (WebSockets).
- Roles de moderador.
