'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks';

export default function LoginPage() {
  const { login, isLoading, error } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(formData);
  };
   
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="bg-card border border-border rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Bienvenido
            </h1>
            <p className="text-muted-foreground">
              Inicia sesión en tu cuenta
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete='email'
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
              <label
                htmlFor="password"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                required
                autoComplete='current-password'
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full px-4 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                placeholder="••••••••"
                disabled={isLoading}
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-primary-foreground py-2.5 px-4 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              ¿No tienes una cuenta?{' '}
              <a
                href="/register"
                className="text-primary hover:underline font-medium"
              >
                Regístrate
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
