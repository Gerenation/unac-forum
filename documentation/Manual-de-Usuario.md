# Manual de Usuario — UNAC Forum

**Proyecto:** Foro web universitario UNAC Forum  
**Versión:** 1.0.0  
**Fecha:** Junio 2026  
**Equipo:** Daniel Santiago Rodríguez Gerena, Abdiel Esteban Amorocho de Sousa, Juan José Oquendo Jaramillo, Karol Dayana Pinto Hortua

---

## Tabla de contenidos

1. [Introducción](#1-introducción)
2. [Requisitos para usar la aplicación](#2-requisitos-para-usar-la-aplicación)
3. [Acceso a la aplicación](#3-acceso-a-la-aplicación)
4. [Pantallas de la aplicación](#4-pantallas-de-la-aplicación)
5. [Guía paso a paso por funcionalidad](#5-guía-paso-a-paso-por-funcionalidad)
6. [Categorías disponibles](#6-categorías-disponibles)
7. [Mensajes y errores frecuentes](#7-mensajes-y-errores-frecuentes)
8. [Preguntas frecuentes](#8-preguntas-frecuentes)

---

## 1. Introducción

**UNAC Forum** es un foro web diseñado para estudiantes de la Universidad Adventista de Colombia (UNAC). Permite compartir anuncios, convocatorias, eventos y temas de interés de la comunidad universitaria.

Con esta aplicación puedes:

- Crear una cuenta e iniciar sesión.
- Ver un tablón de publicaciones ordenado por fecha.
- Buscar y filtrar publicaciones.
- Crear publicaciones con una o varias categorías.
- Dar «me gusta» y comentar publicaciones.
- Eliminar tus propias publicaciones.
- Editar tu perfil personal.

---

## 2. Requisitos para usar la aplicación

| Requisito | Detalle |
|-----------|---------|
| Navegador web | Chrome, Firefox, Edge o Safari (versión reciente) |
| Conexión | La aplicación debe estar ejecutándose en el servidor o en tu equipo local |
| Cuenta | Debes registrarte o usar una cuenta de demostración |

### Cuentas de demostración

| Correo | Contraseña |
|--------|------------|
| `pepito.perez@estudiantes.unac.edu` | `demo123` |
| `fulano.de.tal@estudiantes.unac.edu` | `demo123` |

---

## 3. Acceso a la aplicación

### Iniciar el proyecto (desarrollo local)

1. Asegúrate de tener **Node.js**, **npm** y **MongoDB** instalados.
2. Ejecuta `run_project.bat` (Windows) o levanta manualmente backend y frontend.
3. Abre el navegador en: **http://localhost:5173/**

### Navegación general

| Ruta | Pantalla | ¿Requiere sesión? |
|------|----------|-------------------|
| `/` | Página de bienvenida (Landing) | No |
| `/login` | Iniciar sesión | No |
| `/registro` | Crear cuenta | No |
| `/explorar` | Tablón de publicaciones (Feed) | Sí |
| `/nueva-publicacion` | Crear publicación | Sí |
| `/perfil` | Editar perfil | Sí |

---

## 4. Pantallas de la aplicación

### 4.1 Página de bienvenida (Landing)

Es la primera pantalla al abrir la aplicación.

**Elementos visibles:**

- Logo UNAC y nombre del foro en la cabecera.
- Título principal de bienvenida.
- Ilustración de comunidad universitaria.
- Tarjetas informativas sobre el foro y el registro.
- Botón **«Entrar al foro»** → lleva al inicio de sesión.

---

### 4.2 Iniciar sesión

**Ruta:** `/login`

**Campos del formulario:**

| Campo | Descripción |
|-------|-------------|
| Correo | Correo electrónico registrado |
| Contraseña | Contraseña de la cuenta |

**Acciones:**

- **Entrar al foro** — valida credenciales y abre el tablón.
- **Crear cuenta** — enlace a la pantalla de registro.

---

### 4.3 Registro de usuario

**Ruta:** `/registro`

**Campos del formulario:**

| Campo | Descripción |
|-------|-------------|
| Nombre completo | Tu nombre y apellidos |
| Nombre de usuario | Alias único en el foro |
| Correo | Correo electrónico |
| Contraseña | Mínimo 6 caracteres |
| Confirmar contraseña | Debe coincidir con la contraseña |

**Acciones:**

- **Registrarme** — crea la cuenta e inicia sesión automáticamente.
- **Iniciar sesión** — enlace si ya tienes cuenta.

---

### 4.4 Tablón de publicaciones (Feed)

**Ruta:** `/explorar`

**Cabecera:**

- Logo UNAC Forum.
- Saludo con tu nombre.
- **Mi perfil** — editar datos personales.
- **Nueva publicación** — crear un anuncio.
- **Cerrar sesión** — salir de la cuenta.

**Barra de herramientas:**

| Control | Función |
|---------|---------|
| Buscar | Filtra por título, contenido o autor |
| Filtrar por categoría | Muestra solo publicaciones de una categoría |

**Cada publicación muestra:**

- Título, autor y fecha.
- Una o varias etiquetas de categoría (chips de colores).
- Contenido del anuncio.
- Botón de **me gusta** (♥) con contador.
- Botón de **Comentar** / **Comentarios (N)**.
- Botón **Eliminar** (solo si tú eres el autor).

---

### 4.5 Nueva publicación

**Ruta:** `/nueva-publicacion`

**Campos:**

| Campo | Descripción |
|-------|-------------|
| Título | Máximo 60 caracteres |
| Categorías | Selecciona entre 1 y 5 categorías (casillas) |
| Descripción | Texto del anuncio |

**Acción:**

- **Publicar en el foro** — guarda la publicación y regresa al tablón.

---

### 4.6 Mi perfil

**Ruta:** `/perfil`

**Campos editables:**

| Campo | Descripción |
|-------|-------------|
| Nombre completo | Tu nombre visible en el foro |
| Nombre de usuario | Alias en el sistema |
| Correo electrónico | Correo de la cuenta |
| Contraseña actual | Solo si deseas cambiar la contraseña |
| Contraseña nueva | Mínimo 6 caracteres |

**Acción:**

- **Guardar cambios** — actualiza tu información.

> Si no deseas cambiar la contraseña, deja los dos campos de contraseña en blanco.

---

## 5. Guía paso a paso por funcionalidad

### 5.1 Iniciar sesión

1. Abre **http://localhost:5173/**.
2. Pulsa **«Entrar al foro»**.
3. Escribe tu correo y contraseña.
4. Pulsa **«Entrar al foro»**.
5. Serás redirigido al tablón (`/explorar`).

---

### 5.2 Cerrar sesión

1. En cualquier pantalla autenticada, localiza el botón **«Cerrar sesión»** en la cabecera.
2. Pulsa el botón.
3. Volverás a la pantalla de inicio de sesión.

---

### 5.3 Crear una cuenta

1. En la pantalla de login, pulsa **«Crear cuenta»**.
2. Completa todos los campos del formulario.
3. Asegúrate de que las contraseñas coincidan.
4. Pulsa **«Registrarme»**.
5. Entrarás automáticamente al tablón.

---

### 5.4 Buscar y filtrar publicaciones

1. En el tablón (`/explorar`), usa el campo **Buscar** para escribir palabras clave.
2. Usa el selector **Filtrar por categoría** para ver solo un tipo de anuncio.
3. El listado se actualiza automáticamente.
4. Si no hay resultados, verás: *«No hay publicaciones que coincidan con tu búsqueda o categoría.»*

---

### 5.5 Crear una publicación

1. En el tablón, pulsa **«Nueva publicación»**.
2. Escribe un título (máx. 60 caracteres).
3. Marca entre **1 y 5 categorías** que describan tu anuncio.
4. Escribe la descripción.
5. Pulsa **«Publicar en el foro»**.
6. Verás una notificación de éxito y volverás al tablón.

---

### 5.6 Dar «me gusta» a una publicación

1. En el tablón, localiza la publicación deseada.
2. Pulsa el botón con el icono **♥**.
3. El contador aumentará y el botón se resaltará.
4. Para quitar el like, pulsa el mismo botón otra vez.

---

### 5.7 Comentar una publicación

1. En la publicación, pulsa **«Comentar»** o **«Comentarios (N)»**.
2. Se expandirá el panel de comentarios.
3. Escribe tu comentario en el área de texto (máx. 500 caracteres).
4. Pulsa **«Publicar comentario»**.
5. Tu comentario aparecerá con tu nombre y la fecha.

---

### 5.8 Eliminar una publicación propia

1. Localiza una publicación que **tú hayas creado** (verás el botón **Eliminar**).
2. Pulsa **«Eliminar»**.
3. Confirma en el cuadro de diálogo.
4. La publicación desaparecerá del tablón.

> No puedes eliminar publicaciones de otros usuarios.

---

### 5.9 Editar tu perfil

1. En el tablón, pulsa **«Mi perfil»**.
2. Modifica los campos que desees cambiar.
3. Si cambias la contraseña, completa **Contraseña actual** y **Contraseña nueva**.
4. Pulsa **«Guardar cambios»**.
5. Verás una notificación de éxito y volverás al tablón.

---

## 6. Categorías disponibles

Al crear o filtrar publicaciones, puedes usar estas categorías:

| Categoría interna | Nombre visible |
|-------------------|----------------|
| `convocatoria` | Convocatoria |
| `evento` | Evento |
| `alertaAcademica` | Alerta académica |
| `bienestar` | Bienestar |
| `tecnologia` | Tecnología |
| `deportes` | Deportes |
| `cultura` | Cultura |
| `general` | General |
| `socializacion` | Socialización |

**Nota:** Puedes asignar varias categorías a una misma publicación para describir mejor su contenido.

---

## 7. Mensajes y errores frecuentes

| Mensaje | Causa probable | Qué hacer |
|---------|----------------|-----------|
| *Ingresa tu correo y contraseña.* | Campos vacíos en login | Completa ambos campos |
| *Credenciales inválidas* | Correo o contraseña incorrectos | Verifica los datos o usa cuenta demo |
| *Ya existe un usuario con ese correo* | Correo duplicado en registro | Usa otro correo o inicia sesión |
| *Las contraseñas no coinciden* | Confirmación incorrecta | Repite la misma contraseña |
| *Completa el título y la descripción* | Formulario de publicación incompleto | Llena todos los campos obligatorios |
| *Selecciona al menos una categoría* | No marcaste categorías | Elige entre 1 y 5 categorías |
| *No hay cambios para guardar* | Perfil sin modificaciones | Cambia al menos un campo |
| *Contraseña actual incorrecta* | Contraseña vigente errónea al cambiar | Escribe la contraseña correcta |
| *No autorizado para eliminar* | Intentas borrar publicación ajena | Solo el autor puede eliminar |

---

## 8. Preguntas frecuentes

**¿Necesito internet para usar el foro en local?**  
No necesitas internet externo, pero sí que el backend, frontend y MongoDB estén corriendo en tu equipo.

**¿Se mantiene la sesión al recargar la página?**  
Sí. La sesión permanece activa mientras el token sea válido (hasta 30 días) o hasta que cierres sesión.

**¿Puedo tener varias categorías en una publicación?**  
Sí. Puedes seleccionar entre 1 y 5 categorías al crear una publicación.

**¿Puedo editar una publicación después de publicarla?**  
En esta versión no está disponible la edición de publicaciones; solo puedes eliminarlas si eres el autor.

**¿Puedo eliminar comentarios?**  
En esta versión los comentarios no se pueden eliminar una vez publicados.

**¿Qué pasa si intento entrar al tablón sin iniciar sesión?**  
Serás redirigido automáticamente a la pantalla de inicio de sesión.

---

## Soporte y documentación técnica

Para detalles de instalación, arquitectura y API, consulta el archivo [`readme.md`](../readme.md) en la raíz del proyecto.

Para el detalle formal de cada funcionalidad, consulta la carpeta [`formatos-funcionalidades/`](formatos-funcionalidades/).

---

*Manual de Usuario — UNAC Forum — Entrega Final — Programación Web*
