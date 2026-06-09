# Formato de Funcionalidad F02 — Registrar usuario

| Campo | Valor |
|-------|-------|
| **Proyecto** | UNAC Forum |
| **Código** | F02 |
| **Nombre** | Registrar usuario |
| **Tipo** | Principal |
| **Módulo** | Autenticación |
| **Prioridad** | Alta |
| **Actor** | Visitante (usuario nuevo) |

---

## Descripción

Permite a un visitante crear una cuenta nueva en el foro proporcionando nombre completo, nombre de usuario, correo y contraseña. Tras el registro exitoso, el sistema inicia sesión automáticamente.

---

## Precondiciones

- El correo electrónico no debe estar registrado previamente.
- El nombre de usuario no debe existir en la base de datos.
- La contraseña debe tener al menos 6 caracteres.
- La confirmación de contraseña debe coincidir con la contraseña ingresada.
- Backend y MongoDB deben estar disponibles.

## Postcondiciones

- Se crea un nuevo documento en la colección `usuarios` de MongoDB.
- La contraseña queda hasheada con bcrypt (10 salt rounds).
- Se genera un token JWT y se entrega al cliente.
- El usuario queda autenticado y es redirigido a `/explorar`.

---

## Datos de entrada

| Campo | Tipo | Obligatorio | Validación |
|-------|------|-------------|------------|
| `nombreCompleto` | String | Sí | Mín. 2 caracteres, no vacío |
| `nombreUsuario` | String | Sí | Mín. 2 caracteres, único |
| `correo` | String (email) | Sí | Formato email válido, único |
| `contrasena` | String | Sí | Mín. 6 caracteres |
| `contrasenaConfirmacion` | String | Sí (UI) | Debe coincidir con contraseña |

## Datos de salida

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `token` | String (JWT) | Token de sesión del nuevo usuario |
| `usuario` | Object | Perfil público recién creado |

---

## Flujo principal

1. El usuario accede a `/registro` desde login o enlace directo.
2. Completa los 5 campos del formulario.
3. Pulsa **«Registrarme»**.
4. El frontend valida campos localmente (no vacíos, longitud, coincidencia de contraseñas).
5. Se envía `POST /api/auth/registro` con los datos.
6. El backend verifica unicidad de correo y nombre de usuario.
7. Se crea el usuario, se hashea la contraseña y se firma el JWT.
8. El frontend guarda sesión y redirige a `/explorar`.

---

## Flujos alternos

| ID | Condición | Acción del sistema |
|----|-----------|-------------------|
| FA-01 | Campos incompletos | *«Completa todos los campos.»* |
| FA-02 | Contraseña menor a 6 caracteres | *«La contraseña debe tener al menos 6 caracteres.»* |
| FA-03 | Contraseñas no coinciden | *«Las contraseñas no coinciden.»* |
| FA-04 | Correo ya registrado | *«Ya existe un usuario con ese correo»* |
| FA-05 | Nombre de usuario duplicado | *«Ya existe un usuario con ese nombre de usuario»* |
| FA-06 | Usuario ya autenticado visita `/registro` | Redirige a `/explorar` |

---

## Reglas de negocio

- RN-01: Correo y nombre de usuario son únicos (validación case-insensitive).
- RN-02: La contraseña se hashea en el servidor antes de persistir.
- RN-03: Tras registro exitoso no se requiere un segundo paso de login.
- RN-04: El correo se almacena en minúsculas.

---

## Casos de prueba sugeridos

| ID | Caso | Resultado esperado |
|----|------|-------------------|
| CP-01 | Registro con datos válidos y únicos | Cuenta creada, acceso al feed |
| CP-02 | Registro con correo demo existente | Error de duplicado |
| CP-03 | Contraseñas que no coinciden | Error en formulario |
| CP-04 | Contraseña de 5 caracteres | Error de validación |
| CP-05 | Enlace «Iniciar sesión» | Navega a `/login` |

---

## Archivos relacionados

| Capa | Archivo |
|------|---------|
| Frontend | `src/pages/Registro.jsx` |
| Frontend | `src/context/AuthContext.jsx` |
| Frontend | `src/services/authService.js` |
| Backend | `controllers/authController.js` |
| Backend | `models/Usuario.js` |

---

*Formato F02 — UNAC Forum — Entrega Final*
