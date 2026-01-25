'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/axios';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CreateUserPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      setIsLoading(true);
      await api.post('/api/v1/users', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      router.push('/users');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al crear usuario');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {/* Header */}
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

      {/* Form */}
      <div className="max-w-2xl">
        <div className="bg-card border border-border rounded-lg p-6">
          {error && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
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

            {/* Email */}
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

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="new-password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full px-4 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                placeholder="••••••••"
                disabled={isLoading}
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Confirmar contraseña
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                className="w-full px-4 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                placeholder="••••••••"
                disabled={isLoading}
              />
            </div>

            {/* Actions */}
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
  );
}
