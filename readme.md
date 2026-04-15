# Parcial Programación Web - HTML, CSS y JavaScript - UNAC Forum

## Descripción
UNAC Forum es un foro web estático desarrollado con HTML, CSS y JavaScript puro para la universidad UNAC. Permite a los estudiantes publicar anuncios, eventos y temas de interés, con funcionalidades de autenticación simulada, feed de publicaciones, búsqueda/filtros, likes y creación de posts. Todo se ejecuta en el navegador sin backend (datos simulados en JS + window.name/sesión).

## Características
- **Autenticación**: Login y registro de usuarios (simulado con datos locales).
- **Feed principal**: Explorar publicaciones con búsqueda por texto y filtro por categoría.
- **Likes**: Dar like a publicaciones.
- **Crear publicación**: Formulario para nuevos posts.
- **Demo users**: Ej. `pepito.perez@estudiantes.unac.edu` / `demo123`.

## Equipo de desarrollo
- Daniel Santiago Rodríguez Gerena
- Abdiel Esteban Amorocho de Sousa
- Juan José Oquendo Jaramillo
- Karol Dayana Pinto Hortua


## Uso rápido
1. Abre `index.html` en tu navegador.
2. Regístrate o inicia sesión (usa cuentas de demo si quieres probar rápido).
3. Explora el feed en `feed.html`, crea posts en `create-post.html`.

No requiere instalación. Funciona offline después de cargar.

## Estructura del proyecto

```
unac-forum/
├── index.html              # Página de login
├── register.html           # Página de registro
├── feed.html               # Feed principal (explorar publicaciones)
├── create-post.html        # Formulario para crear nueva publicación
├── css/
│   ├── global.css          # Estilos base (header, footer, layout, colores)
│   ├── auth.css            # Estilos para login/register
│   ├── feed.css            # Estilos para feed y búsqueda/filtros
│   └── formularioPost.css  # Estilos para formulario de post
└── js/
    ├── datos.js            # Datos simulados (usuarios y posts)
    ├── auth.js             # Lógica de login/register
    ├── feed.js             # Render feed, búsqueda, filtros, likes, logout
    └── formularioPost.js   # Lógica de crear post
```

## Descripción detallada de archivos

### HTML
- **index.html**: Interfaz de inicio de sesión. Formulario con email/contraseña. Enlace a registro.
- **register.html**: Formulario de registro (nombre, usuario, email, contraseña x2). Enlace a login.
- **feed.html**: Feed principal. Barra de búsqueda/filtro por categoría, lista de posts con likes, botones nueva publicación/cerrar sesión.
- **create-post.html**: Formulario para nueva publicación (título, contenido, categoría).

### CSS
- **css/global.css**: Estilos globales (cabecera, pie, layout centrado, botones, colores, tipografía, responsive).
- **css/auth.css**: Estilos específicos para tarjetas de auth (login/register).
- **css/feed.css**: Estilos para contenedor de feed, tarjetas de post, likes, barra de herramientas.
- **css/formularioPost.css**: Estilos para formulario de creación de posts.

### JavaScript
- **js/datos.js**: Arrays de datos de prueba (usuarios, posts con id/título/contenido/autor/categoría/likes).
- **js/auth.js**: Manejo de formularios auth (validación, simulación login/register, localStorage usuario actual).
- **js/feed.js**: Renderiza posts dinámicamente, búsqueda (input), filtros (select categoría), likes (contador), logout.
- **js/formularioPost.js**: Validación y envío formulario post (agrega a datos simulados).

## Notas de desarrollo
- **Flujo**: Login → Feed → Crear post / like / search.
- **Persistencia**: Datos en memoria (recarga página reinicia), usuario en localStorage.
- **Mejoras posibles**: Backend real (Node + DB).
- **Testing**: Abre en navegador, prueba login demo, crea post, busca "evento".

