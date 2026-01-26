# Bloxtek Technical Assessment

Este repositorio contiene una aplicación completa con backend (NestJS + TypeORM + PostgreSQL) y frontend (Next.js + Tailwind). A continuación se describen los requisitos, configuración y pasos para ejecutar la aplicación tanto en local como con Docker.

---

## Requisitos previos

- Node.js (recomendado: v18 o superior)
- npm o yarn
- Docker y Docker Compose (v2) — necesarios para ejecutar en contenedores
- (Opcional) PostgreSQL si prefiere levantar la base de datos localmente en vez de usar Docker

---

## Variables de entorno

La aplicación requiere varias variables de entorno. Puede definirlas en archivos `.env` o exportarlas en su entorno.

Variables principales (backend):

- NODE_ENV (opcional) — `development` por defecto
- PORT (opcional) — puerto interno (por defecto 3000)
- DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME — configuración de PostgreSQL
- JWT_SECRET — secreto JWT (mínimo 32 caracteres)
- JWT_EXPIRATION — tiempo de expiración del token (p. ej. `15m`)
- PASSWORD_SALT_ROUNDS (opcional)
- ADMIN_EMAIL, ADMIN_PASSWORD — seeder crea un usuario administrador con estas credenciales
- MANAGER_EMAIL, MANAGER_PASSWORD — seeder crea un usuario gestor
- USER_EMAIL, USER_PASSWORD — seeder crea un usuario estándar
- FRONTEND_URL, COOKIE_DOMAIN — configuración para cookies y CORS

Variables para el frontend (archivo `frontend/.env.local` o variables de entorno):

- NEXT_PUBLIC_API_URL — URL pública del backend (p. ej. `http://localhost:3000`)
- API_URL_INTERNAL — (opcional) URL interna usada cuando se corre Next.js en Docker (`http://backend:3000`)

Ejemplo mínimo de archivo `.env` (raíz, usado por `docker-compose`):

```
# Database
DB_USER=blox_user
DB_PASSWORD=supersecret
DB_NAME=blox_db
DB_PORT=5432

# Backend
BACKEND_PORT=3000
NODE_ENV=development
JWT_SECRET=una_clave_muy_larga_de_al_menos_32_caracteres
JWT_EXPIRATION=15m
PASSWORD_SALT_ROUNDS=10

# Seeder (usuarios iniciales)
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=Admin123!
MANAGER_EMAIL=manager@example.com
MANAGER_PASSWORD=Manager123!
USER_EMAIL=user@example.com
USER_PASSWORD=User123!

# Frontend
FRONTEND_URL=http://localhost:3001
COOKIE_DOMAIN=localhost
```

---

## Ejecutar en local (sin Docker)

### 1) Base de datos

- Puede usar una instancia local de PostgreSQL o levantar la base de datos con Docker:

```
# Desde la raíz del repositorio
docker compose up -d db
```

Asegúrese de que las credenciales de la base de datos coincidan con las variables de entorno definidas para el backend.

### 2) Backend

```
cd backend
npm install
# Crear un archivo .env en backend/ o exportar las variables necesarias
npm run start:dev
```

El servicio de backend intentará conectarse a la base de datos y ejecutará el seeder (`InitSeeder`) en el arranque, creando permisos, roles y usuarios iniciales según las variables `ADMIN_*`, `MANAGER_*` y `USER_*`.

### 3) Frontend

```
cd frontend
npm install
# Crear frontend/.env.local con la variable NEXT_PUBLIC_API_URL apuntando al backend (por ejemplo http://localhost:3000)
npm run dev
```

El frontend quedará disponible en `http://localhost:3001`.

---

## Ejecutar con Docker (recomendado para un entorno replicable)

1) Crear un archivo `.env` en la raíz del proyecto con las variables necesarias (ver ejemplo arriba).

2) Construir y levantar los servicios:

```
docker compose up -d --build
```

Servicios resultantes:

- `bloxtek_db` (Postgres)
- `bloxtek_backend` (NestJS)
- `bloxtek_frontend` (Next.js)

3) Verificar logs:

```
docker compose logs -f backend
```

4) Parar y eliminar contenedores y volúmenes de datos:

```
docker compose down -v
```

Nota: el backend ejecuta el seeder durante el arranque; revise los logs para ver si los usuarios iniciales fueron creados correctamente.

---

## Scripts y comandos útiles

Backend (desde `backend/`):

- `npm run start:dev` — iniciar en modo desarrollo (watch)
- `npm run build` — compilar proyecto
- `npm run start:prod` — iniciar la aplicación compilada

Frontend (desde `frontend/`):

- `npm run dev` — iniciar Next.js en modo desarrollo
- `npm run build` — construir para producción
- `npm run start` — iniciar Next.js en modo producción (tras `build`)

Docker:

- `docker compose up -d --build` — construir y levantar contenedores
- `docker compose up -d db` — levantar solo la base de datos
- `docker compose logs -f backend` — ver logs del backend en tiempo real
- `docker compose down -v` — bajar contenedores y borrar volúmenes

---

## Seguridad y autorización (Backend)

El backend implementa control de acceso basado en roles y permisos. A continuación se resumen los componentes principales:

- Módulos y datos: los módulos `roles` y `permissions` gestionan las entidades y datos relacionados.
- Guards y estrategias: `JwtAuthGuard` autentica solicitudes usando JWT; `LocalAuthGuard` se usa para login; `RolesGuard` y `PermissionsGuard` validan acceso por rol y por permiso respectivamente.
- Decoradores: `@Roles()` y `@Permissions()` permiten anotar controladores o rutas para aplicar la lógica de autorización.
- Seeder: `InitSeeder` crea permisos, roles y usuarios iniciales usando las variables de entorno (`ADMIN_*`, `MANAGER_*`, `USER_*`).
- Extensión: para agregar nuevos roles o permisos, actualice los servicios en `backend/src/modules/roles` y `backend/src/modules/permissions` y proteja las rutas con los decoradores y guards mencionados.

---

## Puntos de atención y resolución de problemas

- **JWT_SECRET** debe contener al menos 32 caracteres.
- Las contraseñas usadas por el seeder deben cumplir la política definida en `backend/src/config/env.schema.ts` (mínimo 8 caracteres, mayúsculas, minúsculas, números y caracteres especiales).
- Si el backend no logra conectarse a PostgreSQL, verifique las variables `DB_*` y que el servicio de DB esté corriendo en el puerto correcto.
- Los seeds se ejecutan automáticamente al iniciar el backend; si necesita resembrar, puede borrar la base de datos y reiniciar el servicio.

---

## Frontend: protección de rutas y providers de autenticación

El frontend implementa protección de rutas y control de acceso mediante providers de autenticación. Los providers (por ejemplo `auth.provider.tsx`) y hooks (`useAuth`) controlan el estado de sesión, redirecciones y accesos a acciones UI; combine esto con variables públicas (`NEXT_PUBLIC_API_URL`) y cookies para gestionar sesiones.

## Contacto

Para detalles adicionales sobre la implementación o estructura interna, revise los archivos `backend/src` y `frontend/src` y los módulos respectivos (`auth`, `users`, `roles`, `permissions`) que contienen la lógica principal.

---

