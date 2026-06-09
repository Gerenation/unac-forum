# Formato de Funcionalidad F10 — Multi-categoría en publicaciones

| Campo | Valor |
|-------|-------|
| **Proyecto** | UNAC Forum |
| **Código** | F10 |
| **Nombre** | Multi-categoría en publicaciones |
| **Tipo** | Secundaria |
| **Módulo** | Foro / Clasificación |
| **Prioridad** | Media |
| **Actor** | Usuario autenticado (al crear) / Usuario autenticado (al filtrar) |

---

## Descripción

Permite asignar entre una y cinco categorías a cada publicación para describir con mayor precisión su contenido e intención. En el feed, cada publicación muestra múltiples chips de categoría, y el filtro encuentra publicaciones que contengan la categoría seleccionada.

---

## Precondiciones

**Al crear:**
- Usuario autenticado.
- Al menos 1 categoría seleccionada.
- Máximo 5 categorías seleccionadas.
- Todas las categorías deben ser valores del enum válido.

**Al filtrar:**
- Usuario autenticado.
- La categoría del filtro debe ser un valor válido o `todas`.

## Postcondiciones

**Al crear:**
- La publicación se guarda con arreglo `categorias[]` en MongoDB.
- En el feed se muestran todos los chips correspondientes.

**Al filtrar:**
- Se listan publicaciones cuyo arreglo `categorias` contiene la categoría elegida.

---

## Datos de entrada

| Campo | Tipo | Contexto | Descripción |
|-------|------|----------|-------------|
| `categorias` | String[] | Crear publicación | 1–5 categorías |
| `categoria` | String | Filtrar feed | Una categoría o `todas` |

## Datos de salida

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `categorias` | String[] | Lista de categorías de la publicación |
| `categoria` | String | Primera categoría (compatibilidad) |

---

## Categorías válidas

`convocatoria`, `evento`, `alertaAcademica`, `bienestar`, `tecnologia`, `deportes`, `cultura`, `general`, `socializacion`.

---

## Flujo principal — Crear con múltiples categorías

1. El usuario accede a `/nueva-publicacion`.
2. Marca varias casillas en la grilla de categorías.
3. El contador muestra: *«Seleccionadas: N / 5»*.
4. Al enviar, el frontend manda `categorias: ["evento", "socializacion", ...]`.
5. El backend normaliza, elimina duplicados y valida el enum.
6. Se persiste el arreglo en MongoDB.
7. En el feed, `PostCard` renderiza un chip por cada categoría.

## Flujo principal — Filtrar por categoría

1. El usuario selecciona una categoría en el selector del feed.
2. El backend aplica `{ categorias: categoriaSeleccionada }`.
3. Aparecen publicaciones que incluyan esa categoría en su arreglo.

---

## Flujos alternos

| ID | Condición | Acción del sistema |
|----|-----------|-------------------|
| FA-01 | 0 categorías al crear | Error: debe elegir al menos una |
| FA-02 | Intento de marcar 6ª categoría | Toast: límite de 5 categorías |
| FA-03 | Datos legacy con campo `categoria` único | Migración automática a `categorias[]` al arrancar backend |
| FA-04 | API recibe `categoria` (string) en lugar de array | Backend convierte a `categorias[]` por compatibilidad |

---

## Reglas de negocio

- RN-01: Mínimo 1 categoría, máximo 5 por publicación.
- RN-02: No se permiten categorías duplicadas en el mismo arreglo.
- RN-03: El filtro por categoría es inclusivo (OR dentro del arreglo de la publicación).
- RN-04: El campo `categoria` en la respuesta API es la primera del arreglo (retrocompatibilidad).

---

## Casos de prueba sugeridos

| ID | Caso | Resultado esperado |
|----|------|-------------------|
| CP-01 | Crear con 3 categorías | 3 chips visibles en feed |
| CP-02 | Crear con 1 categoría | Publicación válida con 1 chip |
| CP-03 | Intentar 6 categorías | Solo se permiten 5 |
| CP-04 | Filtrar «evento» en publicación con `["evento","socializacion"]` | Publicación aparece en filtro |
| CP-05 | Publicación demo «Club de lectura» | Muestra cultura, evento y socialización |

---

## Archivos relacionados

| Capa | Archivo |
|------|---------|
| Frontend | `src/pages/NuevaPublicacion.jsx` |
| Frontend | `src/pages/Feed.jsx` |
| Frontend | `src/constants/categorias.js` |
| Backend | `models/Publicacion.js` |
| Backend | `controllers/publicacionController.js` |
| Backend | `utils/serializers.js` |
| Backend | `services/seedService.js` (migración legacy) |

---

*Formato F10 — UNAC Forum — Entrega Final*
