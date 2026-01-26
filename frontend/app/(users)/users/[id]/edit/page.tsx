'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useUsers } from '@/hooks';
import { useRoles } from '@/hooks/useRoles';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;

  const { getUserById, updateUser, isLoading: isUpdating } = useUsers();
  const { roles, isLoading: rolesLoading, fetchRoles } = useRoles();
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    isActive: true,
    rolesNames: [] as string[],
  });

  useEffect(() => {
    const loadData = async () => {
      setIsFetching(true);
      try {
        const [userData] = await Promise.all([
          getUserById(userId),
          fetchRoles(),
        ]);
        
        if (userData) {
          setFormData({
            name: userData.name,
            email: userData.email,
            isActive: userData.isActive,
            rolesNames: userData.roles?.map((role) => role.name) || [],
          });
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Error al cargar datos');
      } finally {
        setIsFetching(false);
      }
    };

    loadData();
  }, [userId]);

  const handleRoleChange = (roleName: string, checked: boolean) => {
    if (checked) {
      setFormData({ ...formData, rolesNames: [...formData.rolesNames, roleName] });
    } else {
      setFormData({ ...formData, rolesNames: formData.rolesNames.filter(r => r !== roleName) });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await updateUser(userId, {
        name: formData.name,
        email: formData.email,
        isActive: formData.isActive,
        roleNames: formData.rolesNames,
      });
      router.push('/users');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al actualizar usuario');
    }
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/users"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a Usuarios
        </Link>
        <h1 className="text-3xl font-bold text-foreground">Editar Usuario</h1>
        <p className="text-muted-foreground mt-1">
          Actualiza la información del usuario
        </p>
      </div>
      
      <div className="flex justify-center">
        <div className="w-full max-w-2xl">
        <div className="bg-card border border-border rounded-lg p-6">
          {error && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Nombre completo
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                autoComplete="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                disabled={isUpdating}
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Correo electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                disabled={isUpdating}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Roles
              </label>
              {rolesLoading ? (
                <div className="text-sm text-muted-foreground">Cargando roles...</div>
              ) : (
                <div className="space-y-2">
                  {roles.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No hay roles disponibles</p>
                  ) : (
                    roles.map((role) => (
                      <label
                        key={role.id}
                        className="flex items-center gap-2 p-3 bg-background border border-input rounded-lg hover:bg-accent/50 cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={formData.rolesNames.includes(role.name)}
                          onChange={(e) => handleRoleChange(role.name, e.target.checked)}
                          disabled={isUpdating}
                          className="h-4 w-4 rounded border-input text-primary focus:ring-2 focus:ring-ring"
                        />
                        <div>
                          <div className="text-sm font-medium text-foreground">{role.name}</div>
                          {role.description && (
                            <div className="text-xs text-muted-foreground">{role.description}</div>
                          )}
                        </div>
                      </label>
                    ))
                  )}
                </div>
              )}
            </div>
            <div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                  className="h-4 w-4 rounded border-input text-primary focus:ring-2 focus:ring-ring"
                  disabled={isUpdating}
                />
                <span className="text-sm font-medium text-foreground">
                  Usuario activo
                </span>
              </label>
            </div>
            <div className="flex items-center gap-4 pt-4">
              <button
                type="submit"
                disabled={isUpdating}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUpdating ? 'Guardando...' : 'Guardar Cambios'}
              </button>
              <Link
                href="/users"
                className="px-6 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors"
              >
                Cancelar
              </Link>
            </div>
          </form>
        </div>
      </div>
      </div>
    </div>
  );
}
