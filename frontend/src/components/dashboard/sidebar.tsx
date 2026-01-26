'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Users, 
  Shield, 
  Key,
  ChevronLeft
} from 'lucide-react';
import { useState } from 'react';

const menuItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Usuarios',
    href: '/users',
    icon: Users,
  },
  {
    title: 'Roles',
    href: '/roles',
    icon: Shield,
  },
  {
    title: 'Permisos',
    href: '/permissions',
    icon: Key,
  }
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`sticky top-16 h-[calc(100vh-4rem)] border-r border-border bg-card transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-6 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-card hover:bg-accent transition-colors"
      >
        <ChevronLeft
          className={`h-4 w-4 transition-transform ${
            collapsed ? 'rotate-180' : ''
          }`}
        />
      </button>

      <nav className="flex flex-col gap-1 p-4">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              }`}
              title={collapsed ? item.title : undefined}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && (
                <span className="text-sm font-medium">{item.title}</span>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
