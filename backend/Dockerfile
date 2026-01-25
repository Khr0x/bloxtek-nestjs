# ========================================
# ETAPA 1: Construcción (Builder)
# ========================================
FROM node:20-alpine AS builder

# Instalar pnpm globalmente
RUN npm install -g pnpm

# Directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package.json pnpm-lock.yaml ./

# Instalar dependencias (incluyendo devDependencies para el build)
RUN pnpm install --frozen-lockfile

# Copiar el código fuente
COPY . .

# Construir la aplicación NestJS (crea la carpeta /dist)
RUN pnpm run build

# ========================================
# ETAPA 2: Producción (Runner)
# ========================================
FROM node:20-alpine

# Instalar pnpm globalmente
RUN npm install -g pnpm

WORKDIR /app

# Copiar package.json y pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Instalar SOLO dependencias de producción
RUN pnpm install --frozen-lockfile --prod

# Copiar el código compilado desde la etapa de construcción
COPY --from=builder /app/dist ./dist

# Crear usuario no-root para seguridad
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001 && \
    chown -R nestjs:nodejs /app

# Cambiar a usuario no-root
USER nestjs

# Exponer el puerto 
EXPOSE 3000

# Variables de entorno por defecto
ENV NODE_ENV=production

# Comando de inicio
CMD ["pnpm", "run", "start:prod"]