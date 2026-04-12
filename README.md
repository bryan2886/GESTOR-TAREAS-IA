# Gestor de Tareas con IA

Aplicación web para gestionar tareas pendientes con asistencia de inteligencia artificial. Permite crear, visualizar y eliminar tareas con fecha límite, y consultar instrucciones generadas por IA sobre cómo completar cada tarea.

## Funcionalidades

- **Crear tareas**: ingresa el nombre de la tarea y una fecha límite para guardarla.
- **Persistencia local**: las tareas se almacenan en `localStorage`, por lo que se mantienen al recargar la página.
- **Contador de días**: cada tarea muestra cuántos días faltan o cuántos días han pasado desde su vencimiento, con indicador visual en rojo cuando ya venció.
- **Asistencia IA ("¿Cómo hacerlo?")**: al hacer clic en el botón de cada tarea, se consulta a un modelo de IA que devuelve instrucciones concisas (máximo 1000 caracteres) sobre cómo realizar esa tarea.
- **Eliminar tareas**: con confirmación mediante alerta antes de borrar definitivamente.

## Estructura del proyecto

```
GESTOR-TAREAS-IA/
├── index.html                  # Interfaz principal
├── frontend/
│   ├── assets/css/styles.css   # Estilos
│   └── js/main.js              # Lógica del frontend
└── backend/
    ├── server.js               # API REST con Express
    └── package.json
```

## Tecnologías

| Capa      | Tecnología                              |
|-----------|-----------------------------------------|
| Frontend  | HTML, CSS, JavaScript vanilla           |
| Backend   | Node.js, Express 5                      |
| IA        | OpenAI SDK (compatible con cualquier API OpenAI-compatible) |
| UI Libs   | SweetAlert2, JsLoadingOverlay, Font Awesome, Montserrat |

## API

### `POST /how-to`

Recibe el nombre de una tarea y retorna instrucciones generadas por IA sobre cómo completarla.

**Body:**
```json
{ "task": "nombre de la tarea" }
```

**Respuesta exitosa:**
```json
{ "text": "instrucciones en texto plano..." }
```

**Errores:**
- `400` — tarea no enviada o inválida.
- `500` — error al procesar la solicitud con el modelo de IA.

## Configuración

Crea un archivo `.env` dentro de la carpeta `backend/` con las siguientes variables:

```env
API_URL=https://tu-api-compatible-openai/v1
API_KEY=tu_api_key
MODEL=nombre-del-modelo
```

## Instalación y uso

```bash
# Instalar dependencias del backend
cd backend
npm install

# Iniciar el servidor
node server.js
```

Luego abre `index.html` directamente en el navegador (o sírvelo desde XAMPP).

El servidor corre en `http://localhost:3000`.
