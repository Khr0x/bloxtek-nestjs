'use client';

import { useRouter } from 'next/navigation';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export default function ForbiddenPage() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
      <div className="text-center max-w-md px-6">
        <ShieldAlert className="h-20 w-20 text-destructive mx-auto mb-6" />
        <h1 className="text-4xl font-bold text-foreground mb-3">403</h1>
        <h2 className="text-2xl font-semibold text-foreground mb-4">
          Acceso Denegado
        </h2>
        <p className="text-muted-foreground mb-8">
          No tienes los permisos necesarios para acceder a este recurso.
          Por favor, contacta con el administrador si crees que esto es un error.
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 px-6 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </button>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Ir al Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
