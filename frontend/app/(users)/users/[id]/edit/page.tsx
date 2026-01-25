'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { api } from '@/lib/axios';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface User {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
}

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    isActive: true,
  });

  useEffect(() => {
    fetchUser();
  }, [userId]);

  const fetchUser = async () => {
    try {
      setIsFetching(true);
      const response = await api.get(`/api/v1/users/${userId}`);
      const user: User = response.data;
      setFormData({
        name: user.name,
        email: user.email,
        isActive: user.isActive,
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar usuario');
    } finally {
      setIsFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      setIsLoading(true);
      await api.patch(`/api/v1/users/${userId}`, formData);
      router.push('/users');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al actualizar usuario');
    } finally {
      setIsLoading(false);
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
      {/* Header */}
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
                disabled={isLoading}
              />
            </div>

            {/* Active Status */}
            <div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                  className="h-4 w-4 rounded border-input text-primary focus:ring-2 focus:ring-ring"
                  disabled={isLoading}
                />
                <span className="text-sm font-medium text-foreground">
                  Usuario activo
                </span>
              </label>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4 pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Guardando...' : 'Guardar Cambios'}
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
