# AsisteQR API

API REST para el sistema de asistencia escolar por código QR.  
Construida con **NestJS**, **Prisma** y **PostgreSQL**.

## Stack

- **Runtime:** Node.js 18+
- **Framework:** NestJS 11
- **ORM:** Prisma 6
- **Base de datos:** PostgreSQL
- **Auth:** JWT (Passport) + bcryptjs
- **Documentación:** Swagger (OpenAPI)

## Requisitos

- Node.js 18 o superior
- PostgreSQL 14 o superior
- npm

## Instalación

```bash
# 1. Clonar el repositorio
git clone <repo-url>
cd backend

# 2. Instalar dependencias
npm install

# 3. Generar Prisma Client
npx prisma generate

# 4. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales de PostgreSQL
```

## Variables de Entorno

| Variable | Descripción | Ejemplo |
|---|---|---|
| `DATABASE_URL` | URL de conexión a PostgreSQL | `postgresql://user:pass@localhost:5432/asistenciaqr` |
| `JWT_SECRET` | Secreto para firmar JWT | `mi-secreto-jwt` |
| `JWT_EXPIRES_IN` | Tiempo de expiración del token | `7d` |
| `TERMINAL_SECRET` | Secreto HMAC para QR | `mi-secreto-terminal` |
| `PORT` | Puerto del servidor (opcional, default 3000) | `3000` |

## Base de Datos

```bash
# Aplicar migraciones
npx prisma migrate dev

# Poblar la base de datos con datos de prueba
npm run prisma:seed
```

El seed crea los siguientes usuarios:

| Email | Contraseña | Rol |
|---|---|---|
| `director@empresa.com` | `admin1234` | Director |
| `terminal@empresa.com` | `admin1234` | Terminal |
| `empleado1@empresa.com` | `admin1234` | Empleado |

## Ejecución

```bash
# Desarrollo (hot reload)
npm run start:dev

# Producción
npm run build
npm run start:prod
```

## Documentación Swagger

Una vez corriendo, la documentación interactiva está disponible en:

```
http://localhost:3000/api/docs
```

## Estructura del Proyecto

```
src/
├── auth/           # Módulo de autenticación (JWT, login, registro)
├── attendance/     # Módulo de asistencia (check-in, historial, reportes)
├── dashboard/      # Estadísticas del dashboard
├── perfiles/       # CRUD de perfiles (empleados)
├── shifts/         # Gestión de turnos
├── qr-tokens/      # Generación de tokens QR (HMAC stateless)
├── common/         # Decoradores y tipos compartidos
└── main.ts         # Punto de entrada
```

## Endpoints Principales

### Auth
- `POST /api/auth/login` — Iniciar sesión
- `POST /api/auth/register` — Registrar empleado (solo director)
- `GET /api/auth/me` — Perfil del usuario autenticado

### Attendance
- `POST /api/attendance/check-in` — Registrar asistencia con QR (empleado)
- `GET /api/attendance/history` — Historial del empleado autenticado
- `GET /api/attendance/missed-dates` — Fechas faltantes del empleado
- `GET /api/attendance/by-date/:date` — Asistencia por fecha (director)
- `GET /api/attendance/today` — Asistencias del día (director)
- `GET /api/attendance/stats` — Estadísticas (director)

### QR Tokens
- `POST /api/qr-tokens/generate` — Generar token QR (solo terminal)

### Dashboard
- `GET /api/dashboard/stats` — Estadísticas generales (director)

### Profiles
- `GET /api/profiles` — Listar perfiles (director)
- `GET /api/profiles/:id` — Obtener perfil (director)
- `PATCH /api/profiles/:id` — Actualizar perfil (director)

### Shifts
- `GET /api/shifts` — Listar turnos
- `PATCH /api/shifts/:id` — Actualizar turno (director)
