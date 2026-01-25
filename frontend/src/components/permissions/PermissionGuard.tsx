'use client';

import { useAuth } from '@/hooks';
import { ReactNode } from 'react';
import { ShieldAlert } from 'lucide-react';

interface PermissionGuardProps {
  children: ReactNode;
  permission?: string;
  permissions?: string[];
  requireAll?: boolean;
  fallback?: ReactNode;
  showError?: boolean;
}

export function PermissionGuard({
  children,
  permission,
  permissions = [],
  requireAll = false,
  fallback,
  showError = true,
}: PermissionGuardProps) {
  const { permissions: userPermissions, hasPermission, hasAnyPermission } = useAuth();

  // Si se proporciona un solo permiso
  if (permission && !hasPermission(permission)) {
    return fallback || (showError ? <ForbiddenMessage permission={permission} /> : null);
  }

  // Si se proporcionan múltiples permisos
  if (permissions.length > 0) {
    const hasAccess = requireAll
      ? permissions.every(p => userPermissions.includes(p))
      : hasAnyPermission(permissions);

    if (!hasAccess) {
      return fallback || (showError ? <ForbiddenMessage permissions={permissions} /> : null);
    }
  }

  return <>{children}</>;
}

function ForbiddenMessage({ permission, permissions }: { permission?: string; permissions?: string[] }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-card border border-border rounded-lg">
      <ShieldAlert className="h-12 w-12 text-destructive mb-4" />
      <h3 className="text-lg font-semibold text-foreground mb-2">
        Acceso Denegado
      </h3>
      <p className="text-sm text-muted-foreground text-center">
        No tienes los permisos necesarios para acceder a este contenido.
      </p>
      {permission && (
        <p className="text-xs text-muted-foreground mt-2">
          Permiso requerido: <code className="px-2 py-1 bg-muted rounded">{permission}</code>
        </p>
      )}
      {permissions && permissions.length > 0 && (
        <div className="text-xs text-muted-foreground mt-2">
          Permisos requeridos:
          <div className="flex gap-2 mt-1 flex-wrap justify-center">
            {permissions.map(p => (
              <code key={p} className="px-2 py-1 bg-muted rounded">{p}</code>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
