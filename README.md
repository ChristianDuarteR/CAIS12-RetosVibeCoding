# Clínica Veterinaria

Sistema web full-stack para que una clínica veterinaria de barrio gestione sus pacientes, propietarios y visitas médicas en una interfaz en español.

## Objetivo

Centralizar la información de cada mascota y su historial de atención, de modo que el equipo pueda encontrar pacientes, registrar consultas y revisar diagnósticos y tratamientos anteriores.

## Funcionalidades

- Panel con total de pacientes, total de visitas, visitas del día y atenciones recientes.
- Registro, búsqueda, consulta, edición y eliminación confirmada de pacientes.
- Registro, consulta, edición y eliminación de visitas médicas asociadas a un paciente.
- Historial médico por paciente ordenado de la visita más reciente a la más antigua.
- Validación de datos, mensajes de error y persistencia local en SQLite.
- Eliminación en cascada del historial al eliminar un paciente, para evitar visitas sin paciente.

## Tecnologías

- Interfaz: React, TypeScript, Vite y Tailwind CSS.
- API REST: Node.js y Express 5.
- Base de datos: SQLite mediante `node:sqlite` integrado en Node.js 24.
- Contratos y validación: OpenAPI y esquemas Zod generados.

## Estructura del proyecto

```text
artifacts/
  api-server/          API Express y base de datos SQLite
  veterinary-clinic/   Interfaz web React
lib/
  api-spec/            Contrato OpenAPI
  api-client-react/    Hooks React Query generados
  api-zod/             Validación Zod generada
README.md
```

## Requisitos previos

- Node.js 24 o compatible con `node:sqlite`.
- pnpm.

## Instalación y ejecución local

Instala las dependencias desde la raíz del proyecto:

```bash
pnpm install
```

Abre dos terminales desde la raíz del proyecto. La primera inicia la API en el puerto 5000:

```bash
pnpm --filter @workspace/api-server run dev
```

La segunda inicia la interfaz en el puerto 5173:

```bash
pnpm --filter @workspace/veterinary-clinic run dev
```

Abre `http://localhost:5173` en el navegador. Fuera de Replit, Vite envía automáticamente las solicitudes `/api` al servidor Express en `http://127.0.0.1:5000`. Si la API usa otra dirección, configura `LOCAL_API_ORIGIN` al iniciar la interfaz.

En Replit, inicia los workflows **API Server** y **Clínica Veterinaria** para abrir la vista previa conectada. Replit asigna sus propios puertos y enruta `/api`; el proxy local de Vite se habilita solamente fuera de Replit.

Para comprobar los tipos:

```bash
pnpm run typecheck
```

## Base de datos

La API crea las tablas e índices SQLite al iniciar. Por defecto, el archivo se guarda en:

```text
artifacts/api-server/data/veterinary-clinic.sqlite
```

La carpeta de datos se crea automáticamente y está excluida del control de versiones. Para elegir otro archivo, define `SQLITE_DB_PATH` antes de iniciar el servidor. Las tablas `patients` y `visits` mantienen una relación de uno a muchos; las visitas se eliminan automáticamente al borrar al paciente asociado.

No se insertan datos de demostración automáticamente. Los registros creados desde la interfaz se conservan en el archivo SQLite al recargar la aplicación.

## API REST

La API está disponible bajo el prefijo `/api`. Los ejemplos usan `http://localhost:5000/api` para ejecución local. En Replit, define `API_BASE=http://localhost:80/api` para usar el proxy del proyecto.

### Pacientes

| Método | Ruta | Descripción |
| --- | --- | --- |
| GET | `/api/patients?q=` | Lista pacientes; busca por nombre de mascota o propietario |
| GET | `/api/patients/:id` | Consulta la ficha de un paciente |
| POST | `/api/patients` | Registra un paciente |
| PUT | `/api/patients/:id` | Actualiza un paciente |
| DELETE | `/api/patients/:id` | Elimina al paciente y sus visitas asociadas |
| GET | `/api/patients/:id/visits` | Consulta su historial médico más reciente primero |

### Visitas

| Método | Ruta | Descripción |
| --- | --- | --- |
| GET | `/api/visits?patientId=` | Lista visitas; el filtro de paciente es opcional |
| GET | `/api/visits/:id` | Consulta una visita |
| POST | `/api/visits` | Registra una visita |
| PUT | `/api/visits/:id` | Actualiza una visita |
| DELETE | `/api/visits/:id` | Elimina una visita |

### Panel

| Método | Ruta | Descripción |
| --- | --- | --- |
| GET | `/api/dashboard` | Totales y visitas recientes |

## Ejemplos

Registrar un paciente:

```bash
API_BASE="${API_BASE:-http://localhost:5000/api}"

curl -X POST "$API_BASE/patients" \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "Luna",
    "species": "Perro",
    "breed": "Criolla",
    "age": 3,
    "sex": "female",
    "ownerName": "Ana Pérez",
    "ownerPhone": "3001234567"
  }'
```

Registrar una visita para un paciente existente (cambia `patientId` por el identificador devuelto al crear el paciente):

```bash
curl -X POST "$API_BASE/visits" \
  -H 'Content-Type: application/json' \
  -d '{
    "patientId": 1,
    "visitDate": "2026-10-30",
    "reason": "Control general",
    "diagnosis": "Buen estado de salud",
    "treatment": "Continuar controles preventivos",
    "observations": ""
  }'
```

Consultar el historial:

```bash
curl "$API_BASE/patients/1/visits"
```
