# Eventos API

API REST para una plataforma de gestión de eventos, construida con Node.js y Express siguiendo una arquitectura por capas (routes → controllers → services → repositories → DAO → models). Cubre autenticación con JWT, autorización basada en roles, CRUD de eventos con filtros/paginación, y un sistema de inscripciones con control de cupo y notificación por email.

Frontend (React + Vite): _en construcción — link próximamente_.

## Qué resuelve

Cualquier usuario puede registrarse y explorar eventos publicados. Los `organizer` crean y administran sus propios eventos (capacidad, precio, estado). Los usuarios se inscriben a eventos publicados mientras haya cupo disponible, reciben un email de confirmación con su código de reserva, y pueden cancelar su inscripción cuando quieran (liberando el cupo para otra persona). Los `admin` tienen visibilidad y permisos totales sobre eventos y tickets.

## Highlights técnicos

- **Autenticación y autorización real**: Passport (`local` + `jwt`), JWT en cookie httpOnly, passwords hasheadas con bcrypt, middleware de roles reforzado a nivel de ruta.
- **Arquitectura por capas** con responsabilidad única en cada una (ver detalle abajo) — no hay lógica de negocio en controllers, ni Mongoose fuera del DAO.
- **DTOs** que garantizan que ningún endpoint exponga datos sensibles (passwords nunca salen de la API, ni en la respuesta ni en el JWT).
- **Manejo de errores centralizado** con códigos HTTP correctos (400/401/403/404/409/500), incluyendo validación de `ObjectId` malformados.
- **Tests automatizados** con Jest + Supertest + `mongodb-memory-server`: unitarios sobre la capa de servicios y de integración sobre los endpoints críticos (auth, autorización).
- **Reglas de negocio con casos borde cubiertos**: cupo, inscripción duplicada, cancelación sin borrado, envío de email "best effort" (no bloquea la respuesta si falla el SMTP).

## Tecnologías

- Node.js + Express 5
- MongoDB + Mongoose
- Passport (estrategias `local` para register/login, `jwt` para sesión actual)
- JWT en cookie httpOnly
- bcrypt (hashing de contraseñas)
- Nodemailer (email de confirmación de inscripción)
- dotenv, cookie-parser

## Arquitectura

```
src/
├── routes/         # define endpoints y middlewares por ruta
├── controllers/     # coordinan request/response, sin lógica de negocio
├── services/         # lógica de negocio y validaciones
├── repositories/    # intermediario entre services y DAOs
├── dao/              # única capa que importa modelos de Mongoose
├── dto/               # dan forma a las respuestas (nunca exponen password)
├── models/           # esquemas de Mongoose
├── middlewares/     # authenticate, authorize, errorHandler
├── utils/             # AppError, JWT, hashing, mailer, generador de códigos
└── config/           # conexión a DB, configuración de Passport
```

Regla de capas: los modelos de Mongoose solo se importan en los DAO. Los services consumen repositories, nunca DAOs directamente. Los controllers no importan Mongoose ni contienen lógica de negocio. Las respuestas de usuario, evento y ticket pasan siempre por su DTO correspondiente.

## Instalación

```bash
git clone <url-del-repositorio>
cd ProyectoBackEnd2Eventos
npm install
cp .env.example .env   # completar con tus propios valores
npm run dev             # levanta con nodemon
# o
npm start
```

## Variables de entorno

Ver `.env.example`. Se necesitan:

| Variable | Descripción |
|---|---|
| `PORT` | Puerto del servidor |
| `MONGO_URL` | Connection string de MongoDB |
| `JWT_SECRET` | Secreto para firmar el JWT |
| `JWT_EXPIRES_IN` | Expiración del JWT (ej. `1d`) |
| `NODE_ENV` | `development` / `production` (afecta la cookie `secure`) |
| `MAIL_HOST`, `MAIL_PORT`, `MAIL_USER`, `MAIL_PASS`, `MAIL_FROM` | Credenciales SMTP para el email de confirmación (con Gmail, `MAIL_PASS` debe ser una [contraseña de aplicación](https://myaccount.google.com/apppasswords), no la contraseña normal de la cuenta) |

Si el envío de email falla (credenciales inválidas, sin conexión, etc.), la inscripción se crea igual — el mail es "best effort" y no bloquea la respuesta.

## Roles

- **user**: rol por defecto al registrarse. Puede ver eventos publicados, inscribirse y cancelar sus propias inscripciones.
- **organizer**: además de lo anterior, puede crear eventos y administrar (modificar, cambiar estado, ver inscriptos de) los eventos de los que es dueño.
- **admin**: acceso total — puede administrar cualquier evento o ticket, sea o no el dueño.

El registro público (`POST /api/sessions/register`) **no** acepta `role` en el body; todo usuario nuevo nace `user`.

### Cómo crear un usuario de prueba con rol `organizer` o `admin`

Como el registro público solo permite `user`, para probar los roles superiores hay que promoverlos a mano después de registrarlos:

1. Registrate normalmente: `POST /api/sessions/register` con `first_name`, `last_name`, `email`, `password`.
2. Actualizá el rol directo en Mongo (por ejemplo, con `mongosh` o Compass):
   ```js
   db.users.updateOne({ email: "tu_email@ejemplo.com" }, { $set: { role: "organizer" } })
   // o role: "admin"
   ```
3. Volvé a loguearte (`POST /api/sessions/login`) para que el JWT nuevo lleve el rol actualizado.

## Comandos

| Comando | Descripción |
|---|---|
| `npm run dev` | Levanta el servidor con nodemon (recarga automática) |
| `npm start` | Levanta el servidor con node |
| `npm test` | Corre la suite de tests (Jest) |

## Tests

```bash
npm test
```

- **Unitarios** (`tests/unit`): prueban la capa de servicios de forma aislada — reglas de negocio como que el registro público siempre asigna el rol `user`, o que no se puede registrar dos veces el mismo email.
- **Integración** (`tests/integration`): prueban el flujo HTTP completo contra la app (routes → middlewares → controllers → services → DB), incluyendo el manejo de la cookie de sesión (registro → login → `/current`) y el rechazo de credenciales inválidas (`401`).

Corren contra una instancia de MongoDB en memoria (`mongodb-memory-server`), sin depender de una base real ni de datos previos.

## Endpoints

### Sesiones (`/api/sessions`)

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| POST | `/register` | — | Registra un usuario nuevo (rol `user`) |
| POST | `/login` | — | Login, setea cookie JWT httpOnly |
| GET | `/current` | JWT | Devuelve el usuario logueado |
| POST | `/logout` | — | Limpia la cookie de sesión |

### Eventos (`/api/events`)

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| POST | `/` | organizer/admin | Crea un evento (queda en estado `draft`) |
| GET | `/` | — | Lista eventos, con filtros/paginación/orden |
| GET | `/:id` | — | Detalle de un evento |
| PUT | `/:id` | dueño/admin | Modifica un evento (no si está `cancelled`) |
| PATCH | `/:id/status` | dueño/admin | Cambia el estado (`draft`/`published`/`cancelled`/`finished`) |
| POST | `/:eid/tickets` | JWT | Se inscribe a un evento publicado |
| GET | `/:eid/tickets` | dueño/admin | Lista los inscriptos de un evento |

Filtros de `GET /`: `status`, `category`, `location`, `dateFrom`, `dateTo`. Paginación: `page`, `limit`. Orden: `sortBy`, `order` (`asc`/`desc`).

### Tickets (`/api/tickets`)

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/my-tickets` | JWT | Lista las inscripciones propias (con datos básicos del evento) |
| PATCH | `/:tid/cancel` | dueño/admin | Cancela una inscripción (no la elimina), libera cupo |

## Ejemplos de uso

**Registro:**
```bash
curl -X POST http://localhost:8080/api/sessions/register \
  -H "Content-Type: application/json" \
  -d '{"first_name":"Ana","last_name":"Gomez","email":"ana@example.com","password":"clave123"}'
```

**Login** (guarda la cookie para las siguientes requests):
```bash
curl -c cookies.txt -X POST http://localhost:8080/api/sessions/login \
  -H "Content-Type: application/json" \
  -d '{"email":"ana@example.com","password":"clave123"}'
```

**Crear un evento** (requiere rol `organizer` o `admin`):
```bash
curl -b cookies.txt -X POST http://localhost:8080/api/events \
  -H "Content-Type: application/json" \
  -d '{"title":"Congreso Tech 2026","description":"...","category":"tech","date":"2026-12-01","location":"CABA","capacity":100,"price":0}'
```

**Listado paginado y filtrado:**
```bash
curl "http://localhost:8080/api/events?status=published&category=tech&page=1&limit=5&sortBy=date&order=asc"
```

**Inscribirse a un evento publicado:**
```bash
curl -b cookies.txt -X POST http://localhost:8080/api/events/<eventId>/tickets \
  -H "Content-Type: application/json" -d '{}'
```

**Cancelar una inscripción:**
```bash
curl -b cookies.txt -X PATCH http://localhost:8080/api/tickets/<ticketId>/cancel
```

## Flujo de autenticación + inscripción

1. `POST /api/sessions/register` — se crea el usuario (rol `user`).
2. `POST /api/sessions/login` — devuelve el usuario (sin password) y setea la cookie `token` (JWT, httpOnly).
3. `GET /api/sessions/current` — con la cookie, confirma quién está logueado.
4. Un `organizer` crea un evento (`POST /api/events`, queda `draft`) y lo publica (`PATCH /api/events/:id/status` con `{"status":"published"}`).
5. El usuario se inscribe (`POST /api/events/:eid/tickets`): se valida que el evento esté publicado, que no tenga ya una inscripción activa a ese evento, y que haya cupo disponible. Se genera un `reservationCode`, se guarda el ticket y se intenta enviar un email de confirmación.
6. `GET /api/tickets/my-tickets` — el usuario ve sus inscripciones, con los datos básicos del evento.
7. `PATCH /api/tickets/:tid/cancel` — el usuario cancela; el ticket pasa a `cancelled` (no se borra) y el cupo queda libre para una nueva inscripción.
8. `POST /api/sessions/logout` — limpia la cookie; `GET /api/sessions/current` a partir de ahí devuelve `401`.

## A tener en cuenta

- Ninguna respuesta de la API devuelve `password`, ni en el usuario ni en el payload del JWT.
- Los errores usan códigos HTTP según corresponda: `400` (validación), `401` (no autenticado), `403` (sin permisos), `404` (no encontrado), `409` (conflicto: inscripción duplicada o sin cupo), `500` (error interno).
- Un id con formato inválido en cualquier ruta con `:id` devuelve `400`, no `500`.
