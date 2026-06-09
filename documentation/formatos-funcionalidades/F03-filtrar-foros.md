# Formato de Funcionalidad F03 — Filtrar foros (publicaciones)

| Campo | Valor |
|-------|-------|
| **Proyecto** | UNAC Forum |
| **Código** | F03 |
| **Nombre** | Filtrar foros (publicaciones) |
| **Tipo** | Principal |
| **Módulo** | Foro / Feed |
| **Prioridad** | Alta |
| **Actor** | Usuario autenticado |

---

## Descripción

Permite al usuario buscar y filtrar las publicaciones del tablón por texto libre (título, contenido o autor) y por categoría, mostrando solo los resultados que coinciden con los criterios seleccionados.

---

## Precondiciones

- El usuario debe tener sesión activa.
- Debe existir al menos una publicación en la base de datos, o el sistema mostrará mensaje de lista vacía.
- El backend debe responder correctamente a `GET /api/publicaciones`.

## Postcondiciones

- El feed muestra únicamente publicaciones que cumplen los filtros activos.
- Las publicaciones se ordenan de la más reciente a la más antigua.
- Si no hay coincidencias, se muestra mensaje informativo de lista vacía.

---

## Datos de entrada

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|-------------|-------------|
| `q` | String | No | Texto de búsqueda (query param) |
| `categoria` | String | No | Categoría a filtrar; `todas` omite el filtro |

## Datos de salida

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `publicaciones` | Array | Lista de publicaciones serializadas que coinciden |

---

## Flujo principal

1. El usuario accede a `/explorar` (Feed).
2. El sistema carga todas las publicaciones (`q` vacío, categoría `todas`).
3. El usuario escribe en el campo **Buscar**.
4. El frontend actualiza el estado `q` y dispara nueva petición al API.
5. El backend aplica filtro `$or` sobre título, contenido y nombreAutor (regex case-insensitive).
6. El usuario selecciona una categoría en el selector.
7. El backend filtra publicaciones que contengan esa categoría en el arreglo `categorias`.
8. El feed se re-renderiza con los resultados.

---

## Flujos alternos

| ID | Condición | Acción del sistema |
|----|-----------|-------------------|
| FA-01 | Sin resultados | Muestra: *«No hay publicaciones que coincidan con tu búsqueda o categoría.»* |
| FA-02 | Error de red o servidor | Muestra mensaje de error en el feed |
| FA-03 | Sesión expirada (401) | Redirige a login |
| FA-04 | Búsqueda vacía + categoría «Todas» | Muestra todas las publicaciones |
| FA-05 | Publicación con varias categorías | Aparece al filtrar por cualquiera de sus categorías |

---

## Reglas de negocio

- RN-01: La búsqueda por texto es case-insensitive.
- RN-02: El filtro por categoría busca dentro del arreglo `categorias[]`.
- RN-03: Los resultados siempre se ordenan por `fechaIso` descendente.
- RN-04: Los filtros de texto y categoría pueden combinarse simultáneamente.

---

## Casos de prueba sugeridos

| ID | Caso | Resultado esperado |
|----|------|-------------------|
| CP-01 | Buscar «parche» | Solo publicaciones que contengan la palabra |
| CP-02 | Filtrar por «cultura» | Publicaciones con categoría cultura |
| CP-03 | Buscar + filtro combinados | Intersección de ambos criterios |
| CP-04 | Búsqueda sin coincidencias | Mensaje de feed vacío |
| CP-05 | Limpiar búsqueda | Vuelven todas las publicaciones |

---

## Archivos relacionados

| Capa | Archivo |
|------|---------|
| Frontend | `src/pages/Feed.jsx` |
| Frontend | `src/services/publicacionService.js` |
| Frontend | `src/constants/categorias.js` |
| Backend | `controllers/publicacionController.js` (función `listar`) |

---

*Formato F03 — UNAC Forum — Entrega Final*
