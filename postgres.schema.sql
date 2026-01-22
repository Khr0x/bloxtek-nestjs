-- 1. Habilitar extensión para UUIDs (Si usas Postgres < 13 o prefieres uuid-ossp)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- TABLA: USERS
-- ==========================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(100),
    password VARCHAR(255) NOT NULL, -- Recuerda guardar el hash bcrypt, no texto plano
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- TABLA: ROLES
-- ==========================================
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE, -- Ej: 'ADMIN', 'USER'
    description TEXT
);

-- ==========================================
-- TABLA: PERMISSIONS
-- ==========================================
CREATE TABLE permissions (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(100) NOT NULL UNIQUE, -- Ej: 'create:users', 'read:dashboard'
    description TEXT
);

-- ==========================================
-- TABLA: REFRESH_TOKENS
-- ==========================================
CREATE TABLE refresh_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    token VARCHAR(255) NOT NULL, -- Token hasheado
    user_id UUID NOT NULL,
    revoked BOOLEAN DEFAULT FALSE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Relación: Si se borra el usuario, se borran sus tokens
    CONSTRAINT fk_refresh_token_user 
        FOREIGN KEY (user_id) 
        REFERENCES users(id) 
        ON DELETE CASCADE
);

-- ==========================================
-- TABLA PIVOTE: USER_ROLES (Muchos a Muchos)
-- ==========================================
CREATE TABLE user_roles (
    user_id UUID NOT NULL,
    role_id INT NOT NULL,
    
    PRIMARY KEY (user_id, role_id),
    
    CONSTRAINT fk_user_roles_user 
        FOREIGN KEY (user_id) 
        REFERENCES users(id) 
        ON DELETE CASCADE,
        
    CONSTRAINT fk_user_roles_role 
        FOREIGN KEY (role_id) 
        REFERENCES roles(id) 
        ON DELETE CASCADE
);

-- ==========================================
-- TABLA PIVOTE: ROLE_PERMISSIONS (Muchos a Muchos)
-- ==========================================
CREATE TABLE role_permissions (
    role_id INT NOT NULL,
    permission_id INT NOT NULL,
    
    PRIMARY KEY (role_id, permission_id),
    
    CONSTRAINT fk_role_permissions_role 
        FOREIGN KEY (role_id) 
        REFERENCES roles(id) 
        ON DELETE CASCADE,
        
    CONSTRAINT fk_role_permissions_permission 
        FOREIGN KEY (permission_id) 
        REFERENCES permissions(id) 
        ON DELETE CASCADE
);

-- ==========================================
-- FUNCIONES Y TRIGGERS (Automatización)
-- ==========================================
-- Función para actualizar el campo 'updated_at' automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Aplicar el trigger a la tabla users
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ==========================================
-- SEED DATA (Datos Iniciales para Pruebas)
-- ==========================================

-- 1. Crear Roles Básicos
INSERT INTO roles (name, description) VALUES 
('ADMIN', 'Administrador con acceso total'),
('USER', 'Usuario estándar del sistema');

-- 2. Crear Permisos Básicos
INSERT INTO permissions (slug, description) VALUES 
('view:dashboard', 'Puede ver el dashboard principal'),
('manage:users', 'Puede crear y eliminar usuarios');

-- 3. Asignar Permisos a Roles
-- Asignar todos los permisos al rol ADMIN (ID 1)
INSERT INTO role_permissions (role_id, permission_id) 
SELECT 1, id FROM permissions;

-- Asignar solo permiso de dashboard al rol USER (ID 2)
INSERT INTO role_permissions (role_id, permission_id) 
VALUES (2, (SELECT id FROM permissions WHERE slug = 'view:dashboard'));