'use client';

import { Construction, Wrench } from 'lucide-react';

export default function RolesPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)]">
      <div className="text-center max-w-2xl px-6">
        <div className="relative mb-8">
          <Construction className="h-24 w-24 text-muted-foreground/40 mx-auto" />
          <Wrench className="h-12 w-12 text-primary absolute bottom-0 right-1/3 animate-pulse" />
        </div>
        <h1 className="text-4xl font-bold text-foreground mb-4">
          Módulo de Roles
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          En Construcción
        </p>
        <div className="bg-card border border-border rounded-lg p-6 mb-8">
          <p className="text-muted-foreground mb-4">
            Este módulo estará disponible próximamente. Aquí podrás:
          </p>
          <ul className="space-y-2 text-left text-muted-foreground">
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
              Crear y gestionar roles del sistema
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
              Asignar permisos a cada rol
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
              Configurar niveles de acceso
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
              Visualizar roles activos e inactivos
            </li>
          </ul>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Progreso de desarrollo</span>
            <span>25%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div 
              className="bg-primary h-full rounded-full transition-all duration-300"
              style={{ width: '25%' }}
            ></div>
          </div>
        </div>
        <div className="mt-8 inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          Próximamente
        </div>
      </div>
    </div>
  );
}
