'use client';

import { useEffect, useState } from 'react';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { PermissionGuard } from '@/components/permissions/PermissionGuard';
import { useUsers } from '@/hooks';

export default function UsersPage() {
  const { 
    users, 
    isLoading, 
    error, 
    isForbidden, 
    fetchUsers, 
    deleteUser 
  } = useUsers();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  useEffect(() => {
    const params = statusFilter === 'all' ? undefined : { isActive: statusFilter === 'active' };
    fetchUsers(params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este usuario?')) return;
    
    const result = await deleteUser(id);
    
    if (!result.success) {
      if (result.isForbidden) {
        alert('No tienes permiso para eliminar este usuario.');
      } else {
        alert(error || 'Error al eliminar el usuario');
      }
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error && !isForbidden) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-destructive mb-4">{error}</p>
          <button 
            onClick={() => fetchUsers()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PermissionGuard 
      permissions={["users:read"]} 
      requireAll={false}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Usuarios</h1>
          <p className="text-muted-foreground mt-1">
            Gestiona los usuarios del sistema
          </p>
        </div>
         <PermissionGuard permission="users:update" mode="hide">
          <Link
            href="/users/create"
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Nuevo Usuario
          </Link>
         </PermissionGuard>

      </div>

      <div className="flex gap-4 mb-6">
        <div className="w-48">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
            className="w-full px-4 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
          >
            <option value="all">Todos los estados</option>
            <option value="active">Activos</option>
            <option value="inactive">Inactivos</option>
          </select>
        </div>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Buscar por nombre o email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
        />
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Usuario
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Roles
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                    No se encontraron usuarios
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-accent/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-medium text-primary">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-foreground">
                            {user.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-muted-foreground">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-1">
                        {user.roles && user.roles.length > 0 ? (
                          user.roles.map((role, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary"
                            >
                              {role.name}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-muted-foreground">Sin roles</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          user.isActive
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                        }`}
                      >
                        {user.isActive ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <PermissionGuard permission="users:update" mode="hide">
                          <Link
                            href={`/users/${user.id}/edit`}
                            className="p-2 text-muted-foreground hover:text-primary hover:bg-accent rounded-lg transition-colors"
                            title="Editar"
                          >
                            <Edit className="h-4 w-4" />
                          </Link>
                        </PermissionGuard>

                        <PermissionGuard permission="users:delete" mode="hide">
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="p-2 text-muted-foreground hover:text-destructive hover:bg-accent rounded-lg transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </PermissionGuard>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between text-sm text-muted-foreground">
        <div>
          Mostrando {filteredUsers.length} de {users.length} usuarios
        </div>
      </div>
      </PermissionGuard>
    </div>
  );
}
