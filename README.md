# Gestor de Tareas con IA

Aplicación web full-stack para gestionar tareas pendientes con asistencia de inteligencia artificial. El usuario puede crear tareas con fecha límite, visualizar cuántos días faltan para su vencimiento y consultar instrucciones generadas por IA sobre cómo completar cada tarea.

---

## Funcionalidades

- **Crear tareas**: formulario con campo de descripción y fecha límite (no permite fechas pasadas).
- **Persistencia local**: las tareas se guardan en `localStorage` del navegador y se recuperan al recargar la página.
- **Contador de días**: cada tarea muestra cuántos días faltan o cuántos días lleva vencida.
  - Verde cuando falta tiempo.
  - Rojo cuando ya venció.
  - Etiqueta especial "La tarea se vence hoy" cuando la fecha límite es el día actual.
- **Asistencia IA — "¿Cómo hacerlo?"**: consulta al backend que, a través de un modelo de IA, genera instrucciones claras y concisas (máx. 1000 caracteres) sobre cómo realizar la tarea.
- **Eliminar tareas**: botón con icono de papelera que solicita confirmación antes de borrar.
- **Loader global**: overlay animado que bloquea la UI mientras se espera la respuesta de la IA.

---

## Estructura del proyecto

```
GESTOR-TAREAS-IA/
├── index.html                   # Interfaz principal (HTML)
├── frontend/
│   ├── assets/
│   │   └── css/
│   │       └── styles.css       # Estilos de toda la aplicación
│   └── js/
│       └── main.js              # Lógica del frontend (vanilla JS)
└── backend/
    ├── server.js                # Servidor Express con endpoint de IA
    ├── package.json             # Dependencias del backend
    └── .env.example             # Variables de entorno de referencia
```

---

## Tecnologías

| Capa       | Tecnología / Librería                                  | Versión     |
|------------|--------------------------------------------------------|-------------|
| Frontend   | HTML5, CSS3, JavaScript (ES6+)                         | —           |
| Backend    | Node.js + Express                                      | Express ^5  |
| IA         | OpenAI SDK (compatible con cualquier API OpenAI-like)  | ^6.9        |
| Variables  | dotenv                                                 | ^17         |
| CORS       | cors                                                   | ^2.8        |
| UI — alertas | SweetAlert2                                          | ^11 (CDN)   |
| UI — loader  | JsLoadingOverlay                                     | ^1.2 (CDN)  |
| Iconos     | Font Awesome                                           | 6.1 (CDN)   |
| Tipografía | Montserrat (Google Fonts)                              | CDN         |

---

## Frontend

### `index.html`
Página única con dos secciones:
- **Formulario**: campos `¿Qué quieres hacer?` (texto) y `¿Cuándo lo quieres hacer?` (fecha), con botón "Guardar".
- **Lista de tareas**: sección dinámica donde se renderizan las tarjetas de cada tarea.

### `frontend/js/main.js`
Toda la lógica de la aplicación corre en el evento `load` de la ventana.

| Función        | Descripción                                                                 |
|----------------|-----------------------------------------------------------------------------|
| `saveTask()`   | Valida los campos, crea el objeto tarea con `id`, `body` y `date`, y persiste en `localStorage`. |
| `showTasks()`  | Limpia el contenedor y re-renderiza todas las tarjetas con el estado actual. Llama a `deleteTask()` y `howToDo()` tras renderizar. |
| `daysPending(date)` | Calcula la diferencia en días entre la fecha límite y hoy. Devuelve negativo si ya venció. |
| `deleteTask()` | Registra listeners en los botones de eliminar. Muestra alerta de confirmación con SweetAlert2 y actualiza `localStorage`. |
| `howToDo()`    | Registra listeners en los botones "¿Cómo hacerlo?". Hace `POST /how-to` al backend y muestra la respuesta en la tarjeta. |
| `loader(state)` | Muestra u oculta el overlay de carga global usando JsLoadingOverlay. |

### `frontend/assets/css/styles.css`
- Variable CSS `--color-principal: #4D9657` (verde) usada como color de marca.
- Layout centrado con `max-width: 80rem`.
- Tarjetas con `box-shadow` y `border-radius`.
- Bloque de explicación de IA (`.tasks_exp`) oculto por defecto; se muestra al consultar la IA con borde izquierdo azul.
- Botón "¿Cómo hacerlo?" en azul (`#0056FF`) y botón eliminar en rojo (`#FF3F3F`).

---

## Backend

### `backend/server.js`
Servidor Express que expone un único endpoint REST.

#### `POST /how-to`

Recibe el nombre de una tarea y devuelve instrucciones generadas por IA sobre cómo completarla.

**Request body:**
```json
{ "task": "descripción de la tarea" }
```

**Respuesta exitosa `200`:**
```json
{ "text": "instrucciones generadas por el modelo..." }
```

**Errores:**
| Código | Motivo |
|--------|--------|
| `400`  | El campo `task` no fue enviado, no es string o está vacío. |
| `500`  | Error al comunicarse con la API del modelo de IA. |

**Prompt del sistema usado:**
> "Eres un asistente que ayuda a los usuarios a realizar tareas. Proporciona instrucciones claras y concisas para completar la tarea solicitada. Obligatoriamente debes entregar la respuesta máximo en 1000 caracteres, no des saludos ni despedidas."

---

## Configuración

Crea el archivo `backend/.env` basándote en `backend/.env.example`:

```env
API_URL=https://tu-api-compatible-openai/v1
API_KEY=tu_api_key
MODEL=nombre-del-modelo
```

| Variable  | Descripción                                              |
|-----------|----------------------------------------------------------|
| `API_URL` | URL base de la API (compatible con el estándar OpenAI)   |
| `API_KEY` | Clave de autenticación de la API                         |
| `MODEL`   | Identificador del modelo a usar (ej: `gpt-4o`, `llama-3`) |

---

## Instalación y uso

```bash
# 1. Instalar dependencias del backend
cd backend
npm install

# 2. Crear el archivo de variables de entorno
cp .env.example .env
# Edita .env con tus credenciales

# 3. Iniciar el servidor
node server.js
# Servidor corriendo en http://localhost:3000
```

Luego abre `index.html` en el navegador (directamente o sirviéndolo desde XAMPP).

---

## Flujo de la aplicación

```
Usuario llena el formulario
        │
        ▼
  saveTask() → guarda en localStorage
        │
        ▼
  showTasks() → renderiza tarjetas
        │
        ├── [botón "¿Cómo hacerlo?"]
        │         │
        │         ▼
        │   POST /how-to  →  backend  →  API de IA  →  respuesta en tarjeta
        │
        └── [botón eliminar]
                  │
                  ▼
            Confirmación SweetAlert2 → elimina de localStorage → re-renderiza
```
