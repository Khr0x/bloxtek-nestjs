'use client';

import { useAuth } from '@/hooks';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground mb-6">
        Bienvenido, {user?.name || 'Usuario'}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card 1 */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Total Usuarios
          </h3>
          <p className="text-3xl font-bold text-primary">150</p>
        </div>

        {/* Card 2 */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Roles Activos
          </h3>
          <p className="text-3xl font-bold text-primary">5</p>
        </div>

        {/* Card 3 */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Permisos
          </h3>
          <p className="text-3xl font-bold text-primary">24</p>
        </div>
      </div>

      {/* User Info */}
      {user && (
        <div className="mt-8 bg-card border border-border rounded-lg p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Información de Usuario
          </h2>
          <div className="space-y-2">
            <p className="text-muted-foreground">
              <span className="font-medium text-foreground">Email:</span> {user.email}
            </p>
            {user.roles && user.roles.length > 0 && (
              <div>
                <span className="font-medium text-foreground">Roles:</span>
                <div className="flex gap-2 mt-2">
                  {user.roles.map((role: any, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                    >
                      {role.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
