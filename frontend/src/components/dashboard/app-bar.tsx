'use client';

import { ThemeToggle } from '@/components/theme-toggle';
import { useAuth } from '@/hooks';

export function AppBar() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="flex h-16 items-center px-6">
        {/* Logo/Title */}
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold text-foreground">Bloxtek</h1>
        </div>

        {/* Right Section */}
        <div className="ml-auto flex items-center gap-4">
          {/* User Info */}
          <div className="hidden md:flex items-center gap-2 text-sm">
            <div className="text-right">
              <p className="font-medium text-foreground">{user?.name}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
          </div>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Logout Button */}
          <button
            onClick={logout}
            className="px-4 py-2 text-sm bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </header>
  );
}
