# Parcial Programación Web — UNAC Forum

> Foro web dinámico para estudiantes de la UNAC, construido con **React + Vite** (frontend) y **Node.js + Express + MongoDB** (backend). Autenticación real con JWT, persistencia en MongoDB, datos de demostración sembrados al arrancar.

---

## Tabla de contenidos

1. [Stack y características](#1-stack-y-características)
2. [Cómo correr el proyecto](#2-cómo-correr-el-proyecto)
3. [Estructura del proyecto](#3-estructura-del-proyecto)
4. [Base de datos MongoDB](#4-base-de-datos-mongodb)
5. [API REST — endpoints](#5-api-rest--endpoints)
6. [Flujo de la aplicación](#6-flujo-de-la-aplicación)
7. [Documentación por archivo](#7-documentación-por-archivo)
   - [7.1 Raíz](#71-raíz-del-proyecto)
   - [7.2 Backend](#72-backend-backend)
   - [7.3 Frontend](#73-frontend-frontend)
8. [Equipo](#8-equipo)
9. [Notas de desarrollo](#9-notas-de-desarrollo)

---

## 1. Stack y características

### Stack

| Capa | Tecnología |
|---|---|
| Frontend | React 18, Vite 5, react-router-dom v6, axios, react-hot-toast |
| Backend | Node.js, Express 4, Mongoose 8, JWT, bcryptjs, CORS, dotenv |
| Base de datos | MongoDB (local en `mongodb://127.0.0.1:27017/unac_forum`) |
| Lanzador | `run_project.bat` (Windows) |

### Características

- **Autenticación real** con JWT y contraseñas hasheadas (bcrypt).
- **Feed** de publicaciones, ordenadas de la más reciente a la más antigua.
- **Búsqueda por texto** en título, contenido y autor (case-insensitive).
- **Filtro por categoría** (9 categorías).
- **Likes persistentes** con conteo y estado por usuario.
- **Crear publicación** con validación (título máx. 60 caracteres, categoría válida).
- **Cerrar sesión** con limpieza de `localStorage`.
- **Protección de rutas** para `/explorar` y `/nueva-publicacion`.
- **Responsive** con flexbox.
- **Datos demo** sembrados automáticamente al primer arranque.

---

## 2. Cómo correr el proyecto

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
→ Levanta en `http://localhost:5001` y siembra la base de datos.

**Terminal 2 (frontend)**:
```bash
cd frontend
npm install
npm run dev
```
→ Levanta Vite en `http://localhost:5173` con proxy `/api` → `:5001`.

### Credenciales de demostración

| Campo | Valor |
|---|---|
| Email | `pepito.perez@estudiantes.unac.edu` |
| Contraseña | `demo123` |

También existe `fulano.de.tal@estudiantes.unac.edu` / `demo123`.

---

## 3. Estructura del proyecto

```
unac-forum/
├── run_project.bat
├── readme.md
│
├── backend/                        # API REST
│   ├── package.json
│   ├── server.js                   # Entrada
│   ├── app.js                      # Configuración Express
│   ├── .env.example
│   ├── config/database.js
│   ├── controllers/                # Lógica de negocio
│   ├── middleware/auth.js
│   ├── models/                     # Esquemas Mongoose
│   ├── routes/                     # Definición de rutas
│   ├── services/seedService.js
│   └── utils/                      # Datos demo + serializers
│
└── frontend/                       # SPA React
    ├── package.json
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── main.jsx                # Entrada
        ├── app/App.jsx             # Router + Providers
        ├── components/             # auth/, layout/, ui/
        ├── context/AuthContext.jsx
        ├── pages/                  # Login, Registro, Feed, NuevaPublicacion
        ├── services/               # api.js, authService.js, publicacionService.js
        ├── constants/categorias.js
        └── styles/                 # global, auth, feed, formularioPost
```

---

## 4. Base de datos MongoDB

### Conexión

- **Driver**: Mongoose 8.
- **URI por defecto**: `mongodb://127.0.0.1:27017/unac_forum`.
- **Configurable** vía `MONGODB_URI` en `backend/.env`.
- **Conexión** en `backend/config/database.js` (`conectarDB()`).

### Colecciones

#### `usuarios`

| Campo | Tipo | Restricciones |
|---|---|---|
| `_id` | ObjectId | auto |
| `nombreCompleto` | String | requerido, trim, mín. 2 |
| `nombreUsuario` | String | requerido, trim, mín. 2, **único case-insensitive** |
| `correo` | String | requerido, lowercase, trim, regex email, **único case-insensitive** |
| `contrasena` | String | requerido, mín. 6, `select: false` (no se devuelve por defecto) |
| `createdAt` | Date | auto |
| `updatedAt` | Date | auto |

- Las contraseñas se **hashean con bcrypt** (10 salt rounds) en un hook `pre('save')`.
- Los índices únicos usan colación `{ locale: 'es', strength: 2 }` para que `Pepito@x.com` y `pepito@x.com` se consideren duplicados.

#### `publicaciones`

| Campo | Tipo | Restricciones |
|---|---|---|
| `_id` | ObjectId | auto |
| `titulo` | String | requerido, trim, máx. 60 |
| `contenido` | String | requerido, trim |
| `categoria` | String | requerido, **enum** (9 valores) |
| `idAutor` | ObjectId | ref `usuarios`, requerido |
| `nombreAutor` | String | requerido, trim |
| `fechaIso` | Date | default `Date.now`, getter ISO |
| `idsUsuariosQueDieronLike` | ObjectId[] | ref `usuarios`, default `[]` |
| `createdAt` | Date | auto |
| `updatedAt` | Date | auto |

### Categorías válidas (enum)

`convocatoria`, `evento`, `alertaAcademica`, `bienestar`, `tecnologia`, `deportes`, `cultura`, `general`, `socializacion`.

### Siembra automática (seed)

`backend/services/seedService.js` ejecuta `sembrarSiVacio()` al arrancar el backend:

1. Cuenta documentos en `usuarios` y `publicaciones`.
2. Si ambas colecciones están vacías, inserta:
   - **2 usuarios demo** (con contraseñas hasheadas, una por una para que dispare el hook `pre('save')`).
   - **3 publicaciones demo** con `idAutor` y `likesIndice` mapeados a los `_id` reales de los usuarios recién creados.
3. Si ya hay datos, registra un mensaje y no hace nada.

### Datos de demostración

**Usuarios** (`backend/utils/seedData.js` → `USUARIOS_DUMMY`):

| Índice | nombreCompleto | nombreUsuario | correo | contrasena (texto plano, se hashea al insertar) |
|---|---|---|---|---|
| 0 | Pepito Pérez | `pepitoPerez` | `pepito.perez@estudiantes.unac.edu` | `demo123` |
| 1 | Fulano de Tal | `ThefulanoDeTal` | `fulano.de.tal@estudiantes.unac.edu` | `demo123` |

**Publicaciones** (`PUBLICACIONES_INICIALES`):

| Título | Categoría | Autor (índice) | Likes (índices) | Fecha |
|---|---|---|---|---|
| Club de lectura: ciencia ficción latinoamericana | `cultura` | 0 (Pepito) | [1] (Fulano) | 2026-04-01 |
| Taller de bienestar emocional (gratuito) | `bienestar` | 1 (Fulano) | [] | 2026-04-03 |
| Sale parche al cerro de las 3 cruces | `socializacion` | 0 (Pepito) | [] | 2026-04-04 |

### Operaciones útiles con `mongosh`

```bash
# Conectar
mongosh "mongodb://127.0.0.1:27017/unac_forum"

# Ver usuarios (sin contraseña)
db.usuarios.find({}, { contrasena: 0 })

# Ver publicaciones
db.publicaciones.find().sort({ fechaIso: -1 })

# Borrar todo (forzar re-siembra al próximo arranque del backend)
db.dropDatabase()
```

---

## 5. API REST — endpoints

| Método | Ruta | Auth | Body / Query | Respuesta |
|---|---|---|---|---|
| GET | `/` | — | — | `{ mensaje, version }` |
| POST | `/api/auth/registro` | — | `{ nombreCompleto, nombreUsuario, correo, contrasena }` | `{ token, usuario }` |
| POST | `/api/auth/login` | — | `{ correo, contrasena }` | `{ token, usuario }` |
| GET | `/api/auth/perfil` | ✅ Bearer | — | `{ usuario }` |
| GET | `/api/publicaciones` | ✅ Bearer | `?q=texto&categoria=valor` | `{ publicaciones: [...] }` |
| POST | `/api/publicaciones` | ✅ Bearer | `{ titulo, contenido, categoria }` | `{ publicacion }` |
| POST | `/api/publicaciones/:id/like` | ✅ Bearer | — | `{ publicacion }` (con `usuarioYaDioLike` invertido) |

### Formato del objeto `usuario` (respuesta)

```json
{
  "id": "6a1f1edb94b30782578e961a",
  "nombreCompleto": "Pepito Pérez",
  "nombreUsuario": "pepitoPerez",
  "correo": "pepito.perez@estudiantes.unac.edu"
}
```

### Formato del objeto `publicacion` (respuesta)

```json
{
  "id": "6a1f1fed94034f11fe98a1d9",
  "titulo": "Club de lectura: ciencia ficción latinoamericana",
  "contenido": "Se abre inscripción para el círculo de lectura del mes...",
  "categoria": "cultura",
  "idAutor": "6a1f1edb94b30782578e961a",
  "nombreAutor": "Pepito Pérez",
  "fechaIso": "2026-04-01T15:00:00.000Z",
  "likes": ["6a1f1edb94b30782578e961b"],
  "cantidadLikes": 1,
  "usuarioYaDioLike": false
}
```

### Autenticación

Todas las rutas protegidas requieren el header:
```
Authorization: Bearer <token>
```
El token es un JWT firmado con `JWT_SECRET` (en `.env`) y expira a los **30 días**.

---

## 6. Flujo de la aplicación

1. **Carga inicial**: el usuario abre `http://localhost:5173/`. `<AuthProvider>` lee `localStorage`; si hay token válido, hidrata el usuario.
2. **Login** → `POST /api/auth/login` → backend valida y devuelve JWT → frontend guarda en `localStorage` → navega a `/explorar` (tras 400 ms).
3. **Feed** → `GET /api/publicaciones` → backend filtra/ordena → renderiza tarjetas.
4. **Like** → `POST /api/publicaciones/:id/like` → backend `$addToSet` o `$pull` → frontend reemplaza solo esa tarjeta.
5. **Nueva publicación** → `POST /api/publicaciones` → backend crea → navega a `/explorar` (tras 450 ms).
6. **Logout** → limpia `localStorage` y `usuario = null` → navega a `/`.

---

## 7. Documentación por archivo

### 7.1 Raíz del proyecto

| Archivo | Descripción |
|---|---|
| `run_project.bat` | Lanzador Windows. Verifica Node/npm, inicia MongoDB, instala deps, copia `.env`, abre dos ventanas (backend + frontend). |
| `readme.md` | Este documento. |

### 7.2 Backend (`backend/`)

#### Archivos de configuración

| Archivo | Descripción |
|---|---|
| `package.json` | CommonJS. Deps: `express`, `mongoose@^8`, `bcryptjs`, `jsonwebtoken`, `cors`, `dotenv`. DevDep: `nodemon`. Scripts `start` y `dev`. |
| `.env.example` | Plantilla: `PORT=5001`, `MONGODB_URI`, `JWT_SECRET`. |
| `.gitignore` | Ignora `node_modules`, `.env`, `*.log`. |

#### Entrada y configuración

| Archivo | Descripción |
|---|---|
| `server.js` | Entrada. Carga `.env` → `conectarDB()` → `sembrarSiVacio()` → `app.listen(PORT)`. Si falla la DB, `process.exit(1)`. |
| `app.js` | Express puro. CORS + JSON (8MB) + urlencoded. Monta `/api/auth` y `/api/publicaciones`. Handlers 404 y 500. Exporta la app. |
| `config/database.js` | `conectarDB()` lee `MONGODB_URI` (default `mongodb://127.0.0.1:27017/unac_forum`) y conecta con Mongoose. |

#### Modelos

| Archivo | Descripción |
|---|---|
| `models/Usuario.js` | Esquema Mongoose: `nombreCompleto`, `nombreUsuario`, `correo`, `contrasena` (con `select: false`). Hook `pre('save')` hashea con bcrypt. Método `compararContrasena(plain)`. Índices únicos con colación case-insensitive. |
| `models/Publicacion.js` | Esquema Mongoose: `titulo` (máx. 60), `contenido`, `categoria` (enum 9 valores), `idAutor` (ref Usuario), `nombreAutor`, `fechaIso`, `idsUsuariosQueDieronLike` (array de ObjectId). Timestamps. Exporta también `CATEGORIAS`. |

#### Middleware

| Archivo | Descripción |
|---|---|
| `middleware/auth.js` | `autenticar` lee `Authorization: Bearer <token>`, verifica con `JWT_SECRET`, carga el usuario (sin contraseña) y lo adjunta a `req.usuario`. Devuelve 401 si falta/invalida. |

#### Controladores

| Archivo | Descripción |
|---|---|
| `controllers/authController.js` | `registrar` (valida, crea, hashea via hook, firma JWT 30d), `login` (busca case-insensitive, compara con `compararContrasena`, firma JWT), `obtenerPerfil` (devuelve `req.usuario`). Helper `escapeRegex` para prevenir regex injection. |
| `controllers/publicacionController.js` | `listar` (filtra por `q` y `categoria`, ordena por `fechaIso` desc, calcula `cantidadLikes` y `usuarioYaDioLike` por publicación), `crear` (valida título ≤ 60 + categoría válida, asigna `idAutor`/`nombreAutor` de `req.usuario`), `toggleLike` (`$addToSet` o `$pull` según estado actual). |

#### Rutas

| Archivo | Descripción |
|---|---|
| `routes/authRoutes.js` | `POST /registro`, `POST /login`, `GET /perfil` (autenticado). |
| `routes/publicacionRoutes.js` | `router.use(autenticar)` aplica auth a todo. `GET /`, `POST /`, `POST /:id/like`. |

#### Servicios

| Archivo | Descripción |
|---|---|
| `services/seedService.js` | `sembrarSiVacio()`. Si las colecciones están vacías, crea 2 usuarios con `Usuario.create()` uno a uno (para que dispare `pre('save')` y hashee) y 3 publicaciones con `idAutor`/`likes` mapeados a los `_id` reales. |

#### Utilidades

| Archivo | Descripción |
|---|---|
| `utils/seedData.js` | Constantes: `LONGITUD_MAXIMA_TITULO=60`, `CATEGORIAS_DISPONIBLES` (9), `USUARIOS_DUMMY` (2), `PUBLICACIONES_INICIALES` (3 con `autorIndice` y `likesIndice`). |
| `utils/serializers.js` | `usuarioPublico(doc)` → `{id, nombreCompleto, nombreUsuario, correo}`. `publicacionPublico(doc, usuarioId)` → incluye `cantidadLikes` y `usuarioYaDioLike`. |

### 7.3 Frontend (`frontend/`)

#### Configuración y entrada

| Archivo | Descripción |
|---|---|
| `package.json` | ESM (`"type": "module"`). Deps: `react`, `react-dom`, `react-router-dom@^6`, `axios`, `framer-motion`, `react-hot-toast`, `lucide-react`. DevDeps: `vite@^5`, `@vitejs/plugin-react`. |
| `vite.config.js` | Plugin React. Dev server en puerto **5173**. Proxy `/api` → `http://localhost:5001` con `changeOrigin: true`. |
| `index.html` | HTML raíz de Vite. `<div id="root">` + `<script type="module" src="/src/main.jsx">`. |
| `.gitignore` | Ignora `node_modules`, `dist`, `*.log`. |

#### Raíz de React

| Archivo | Descripción |
|---|---|
| `src/main.jsx` | Punto de entrada. Importa los 4 CSS (`global`, `auth`, `feed`, `formularioPost`) y monta `<App />` en `<StrictMode>`. |
| `src/app/App.jsx` | `<BrowserRouter>` + `<AuthProvider>` + `<Toaster>` + `<Routes>`. Rutas: `/` (Login), `/registro`, `/explorar` (protegido), `/nueva-publicacion` (protegido), `*` → `/`. |

#### Componentes

| Archivo | Descripción |
|---|---|
| `src/components/auth/ProtectedRoute.jsx` | Si `cargando`, retorna `null`. Si no autenticado, `<Navigate to="/" replace />`. Si autenticado, renderiza `children`. |
| `src/components/layout/Header.jsx` | Cabecera reutilizable. Props: `subtitulo`, `navLinks[]`, `navLabel`. Renderiza marca, saludo y nav con botones/enlaces. Incluye "Cerrar sesión" (llama a `logout` del contexto). |
| `src/components/layout/Footer.jsx` | Pie de página simple con `<footer class="pie-sitio">`. |
| `src/components/ui/Message.jsx` | Mensaje de error/éxito. Si no hay `texto`, retorna `null`. Clase `mensaje-error` o `mensaje-exito` según prop `error`. |
| `src/components/ui/Field.jsx` | Wrapper `<div class="campo-formulario"><label>{label}</label>{children}</div>`. |

#### Contexto

| Archivo | Descripción |
|---|---|
| `src/context/AuthContext.jsx` | Estado: `usuario`, `cargando`. En mount, lee `localStorage` y valida el token con `obtenerPerfil()`. Expone: `login(correo, contrasena)`, `registro(datos)`, `logout()`, `estaAutenticado`. |

#### Páginas

| Archivo | Descripción |
|---|---|
| `src/pages/Login.jsx` | Inicio de sesión. Agrega `layout-centrado` al `<body>` en `useEffect`. Estado: `correo`, `contrasena`, `error`, `enviando`. Llama a `login()`, navega a `/explorar` tras 400 ms. Enlace a `/registro`. |
| `src/pages/Registro.jsx` | Registro. Mismo patrón (agrega `layout-centrado` al body). Estado: 5 campos + `error` + `enviando`. Valida localmente (no vacíos, contraseña ≥ 6, coinciden). Llama a `registro()`, navega a `/explorar` tras 400 ms. Enlace a `/`. |
| `src/pages/Feed.jsx` | Foro principal. Estado: `publicaciones`, `cargando`, `error`, `q` (búsqueda), `categoria` (filtro). `useEffect` recarga al cambiar `q` o `categoria`. Al hacer like, actualiza solo esa publicación. Renderiza `<Header>`, toolbar, `<p id="textoFeedVacio" hidden>`, `<div id="contenedorFeed">` con `PostCard`s, `<Footer>`. |
| `src/pages/NuevaPublicacion.jsx` | Formulario de nueva publicación. Estado: `titulo`, `categoria`, `contenido`, `error`, `enviando`. `maxLength={60}` en título. Llama a `crearPublicacion`, navega a `/explorar` tras 450 ms. |

#### Servicios (HTTP)

| Archivo | Descripción |
|---|---|
| `src/services/api.js` | Axios con `baseURL: '/api'`. Request interceptor: añade `Bearer` desde `localStorage`. Response interceptor: en 401 limpia storage y redirige a `/`. |
| `src/services/authService.js` | `registrarUsuario(d)`, `loginUsuario(c)`, `obtenerPerfil()` — wrappers de axios hacia `/auth/*`. |
| `src/services/publicacionService.js` | `listarPublicaciones({q, categoria})`, `crearPublicacion(d)`, `toggleLike(id)` — wrappers hacia `/publicaciones/*`. |

#### Constantes

| Archivo | Descripción |
|---|---|
| `src/constants/categorias.js` | `LONGITUD_MAXIMA_TITULO=60`, `CATEGORIAS_DISPONIBLES` (9), `etiquetaCategoria(cat)` (mapa a etiqueta legible), `formatearFechaLegible(iso)` (formato `es-CO`). |

#### Estilos

| Archivo | Descripción |
|---|---|
| `src/styles/global.css` | Variables CSS del tema oscuro, `body`, inputs, `cabecera-sitio` (gradiente azul), marca, `pie-sitio`, `layout-centrado`, `#root` flex column, `#root > main` con padding 2.5rem/2rem, `.boton-primario` (dorado), `.boton-secundario` (borde), `.barra-usuario-cabecera`, `.nav-cabecera-feed`. |
| `src/styles/auth.css` | `.tarjeta-auth` (420px, sombra, borde), `.tarjeta-auth-titulo`, `.tarjeta-auth-descripcion`, `.formulario-auth`, `.campo-formulario`, focus dorado, `.acciones-formulario-auth` (compuesto que hace el submit full-width), `.enlaces-auth`, `.mensaje-error`/`.mensaje-exito`. |
| `src/styles/feed.css` | `body > main` con padding, `.barra-herramientas-feed` (flex wrap con buscador + filtro), `.contenedor-feed-principal` (1080px), `.contenedor-feed`, `.feed-vacio`, `.tarjeta-post` (grid 2×2 en encabezado), `.chip-categoria` + 9 variantes por color, `.tarjeta-post-cuerpo`, `.tarjeta-post-pie`, `.boton-like` y `.boton-like-activo` (estado rosa). |
| `src/styles/formularioPost.css` | `body > main` con padding, `.contenedor-formulario-post` (640px), `.formulario-crear-post` (flex column, sombra), estilos de `<h1>`, `.texto-ayuda`, textarea/select dentro de `.campo-formulario`, `.hint-caracteres`, `.acciones-crear-post` (botón min 180px). |

---

## 8. Equipo

- Daniel Santiago Rodríguez Gerena
- Abdiel Esteban Amorocho de Sousa
- Juan José Oquendo Jaramillo
- Karol Dayana Pinto Hortua

---

## 9. Notas de desarrollo

- **HMR de Vite**: cambios en CSS y componentes se aplican al instante sin recargar.
- **nodemon**: cambios en el backend recargan el servidor automáticamente.
- **Persistencia tras recargar**: el JWT en `localStorage` mantiene la sesión activa (30 días de expiración).
- **Limpiar la base de datos**: `mongosh` → `use unac_forum` → `db.dropDatabase()`. Al próximo arranque del backend se re-siembran los datos demo.
- **Cambiar `JWT_SECRET` en producción**: editar `backend/.env` (no commitear).
- **Posibles mejoras**: comentarios en publicaciones, paginación del feed, imágenes adjuntas, notificaciones en tiempo real, roles de moderador.
