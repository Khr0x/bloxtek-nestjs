'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUsers } from '@/hooks';
import { useRoles } from '@/hooks/useRoles';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

export default function CreateUserPage() {
  const router = useRouter();
  const [errorUI, setError] = useState<string | null>(null);
  const { isLoading, createUser } = useUsers();
  const { roles, isLoading: rolesLoading, fetchRoles } = useRoles();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    roleNames: [] as string[],
  });

  useEffect(() => {
    fetchRoles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRoleChange = (roleName: string, checked: boolean) => {
    if (checked) {
      setFormData({ ...formData, roleNames: [...formData.roleNames, roleName] });
    } else {
      setFormData({ ...formData, roleNames: formData.roleNames.filter(r => r !== roleName) });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
    if (!passwordRegex.test(formData.password)) {
      setError('La contraseña debe contener al menos una letra mayúscula, una minúscula, un número y un carácter especial (@$!%*?&)');
      return;
    }

    try {
      await createUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        roleNames: formData.roleNames,
      });
      router.push('/users');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al crear usuario');
    } 
  };

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
        <h1 className="text-3xl font-bold text-foreground">Crear Usuario</h1>
        <p className="text-muted-foreground mt-1">
          Completa el formulario para crear un nuevo usuario
        </p>
      </div>
      
      <div className="flex justify-center">
        <div className="w-full max-w-2xl">
        <div className="bg-card border border-border rounded-lg p-6">
          {errorUI && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-sm text-destructive">{errorUI}</p>
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
                placeholder="Juan Pérez"
                disabled={isLoading}
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
                placeholder="correo@ejemplo.com"
                disabled={isLoading}
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
                          checked={formData.roleNames.includes(role.name)}
                          onChange={(e) => handleRoleChange(role.name, e.target.checked)}
                          disabled={isLoading}
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
              <label
                htmlFor="password"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full px-4 py-2 pr-10 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                  placeholder="••••••••"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Confirmar contraseña
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  autoComplete="new-password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, confirmPassword: e.target.value })
                  }
                  className="w-full px-4 py-2 pr-10 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                  placeholder="••••••••"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            <div className="flex items-center gap-4 pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Creando...' : 'Crear Usuario'}
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
