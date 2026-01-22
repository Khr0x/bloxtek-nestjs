---
applyTo: '**'
---
Provide project context and coding guidelines that AI should follow when generating code, answering questions, or reviewing changes.

La arquitectuira del proyecto backend es la siguiente:

/backend
├── src
│   ├── app.module.ts
│   ├── main.ts
│   │
│   ├── /common              # Shared logic
│   │   ├── /decorators      # Ej: @CurrentUser(), @Roles()
│   │   ├── /guards          # Ej: JwtAuthGuard, RolesGuard 
│   │   ├── /filters         # Manejo de excepciones global
│   │   └── /interfaces
│   │
│   ├── /config              # Variables de entorno validadas 
│   │   └── env.schema.ts    # Joi validation para process.env
│   │
│   └── /modules             # Módulos por dominio 
│       ├── /auth
│       │   ├── /strategies  # JwtStrategy, LocalStrategy
│       │   ├── auth.controller.ts
│       │   ├── auth.service.ts
│       │   └── auth.module.ts
│       │
│       ├── /users
│       │   ├── /dto         # CreateUserDto (Validación class-validator) 
│       │   ├── users.controller.ts
│       │   ├── users.service.ts
│       │   └── users.module.ts
│       │
│       └── /database        # Configuración de Prisma/TypeORM
├── test                     # E2E Tests (Punto extra)
├── Dockerfile               # Dockerización backend 
├── .env.example
└── package.json


Requerimientos y lineamientos de codificación:
- Utilizar TypeScript con tipado estricto.
- Seguir el estilo de codificación de NestJS.
- Usar el ORM Prisma para interacciones con la base de datos.
- La base de datos principal es PostgreSQL.
- Implementar autenticación JWT.
- Validar variables de entorno con Joi.

La arquitectura del proyecto frontend es la siguiente:

/frontend
├── src
│   ├── /app                 # App Router
│   │   ├── layout.tsx       # Layout principal
│   │   ├── page.tsx         # Landing (redirección a login)
│   │   │
│   │   ├── (auth)           # Route Group (layout compartido para auth)
│   │   │   ├── login
│   │   │   │   └── page.tsx # Vista Login 
│   │   │   └── register
│   │   │       └── page.tsx # Vista Registro 
│   │   │
│   │   └── (protected)      # Rutas protegidas
│   │       ├── layout.tsx   # Verifica cookie/token aquí
│   │       └── dashboard
│   │           └── page.tsx # Interfaz principal 
│   │
│   ├── /components          # Componentes Reutilizables
│   │   ├── /ui              # Botones, Inputs, Cards (Diseño limpio) 
│   │   └── /forms           # Formularios de Login/Registro
│   │
│   ├── /lib                 # Lógica de negocio cliente
│   │   ├── axios.ts         # Instancia Axios con interceptors (para refresh token)
│   │   └── auth.ts          # Manejo de sesiones (NextAuth o custom context)
│   │
│   ├── /hooks               # Custom hooks (ej: useAuth)
│   └── /types               # Interfaces TypeScript compartidas
│
├── Dockerfile               # Dockerización frontend 
├── middleware.ts            # Protección de rutas en Next.js (Edge) 
└── package.json

Requerimientos y lineamientos de codificación:
- Utilizar TypeScript con tipado estricto.
- Seguir el estilo de codificación de Next.js y React.
- Usar el App Router de Next.js.
- Implementar protección de rutas con middleware.
- Manejar el estado de autenticación con React Context o NextAuth.
- Utilizar Axios para llamadas HTTP al backend.