import { useState, useCallback } from 'react';
import { UserService } from '@/services/user.services';
import { CreateUser, UpdateUser, User } from '@/types';
import { useApiRequest } from './useApiRequest';

interface UseUsersReturn {
  users: User[];
  isLoading: boolean;
  error: string | null;
  isForbidden: boolean;
  fetchUsers: (params?: { isActive?: boolean }) => Promise<void>;
  getUserById: (id: string) => Promise<User | null>;
  createUser: (user: CreateUser) => Promise<User | null>;
  updateUser: (id: string, user: UpdateUser) => Promise<User | null>;
  deleteUser: (id: string) => Promise<{ success: boolean; isForbidden?: boolean }>;
  refreshUsers: () => Promise<void>;
}

export function useUsers(): UseUsersReturn {
  const [users, setUsers] = useState<User[]>([]);
  const { execute, isLoading, error, isForbidden } = useApiRequest<any>({
    redirectOnForbidden: false
  });

  const fetchUsers = useCallback(async (params?: { isActive?: boolean }) => {
    const data = await execute(() => UserService.findAll(params));
    if (data) {
      setUsers(data);
    }
  }, [execute]);

  const getUserById = useCallback(async (id: string): Promise<User | null> => {
    const user = await execute(() => UserService.findById(id));
    return user;
  }, [execute]);

  const createUser = useCallback(async (user: CreateUser): Promise<User | null> => {
    const newUser = await execute(() => UserService.create(user));
    if (newUser) {
      setUsers(prev => [...prev, newUser]);
    }
    return newUser;
  }, [execute]);

  const updateUser = useCallback(async (id: string, user: UpdateUser): Promise<User | null> => {
    const updatedUser = await execute(() => UserService.update(id, user));
    if (updatedUser) {
      setUsers(prev => prev.map(u => u.id === id ? updatedUser : u));
    }
    return updatedUser;
  }, [execute]);

  const deleteUser = useCallback(async (id: string): Promise<{ success: boolean; isForbidden?: boolean }> => {
    try {
      const result = await execute(() => UserService.delete(id));
      if (result !== null) {
        setUsers(prev => prev.filter(u => u.id !== id));
        return { success: true };
      }
      return { success: false };
    } catch (err: any) {
      const isForbidden = err.response?.status === 403 || err.isForbidden;
      return { success: false, isForbidden };
    }
  }, [execute]);

  const refreshUsers = useCallback(async () => {
    await fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    isLoading,
    error,
    isForbidden,
    fetchUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    refreshUsers,
  };
}