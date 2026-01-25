'use client';
import { AuthService } from "@/services";
import { LoginRequest, RegisterRequest } from "@/types";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useEffect, useState, useRef } from "react";

interface AuthContextType {
  user: any | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isCheckingAuth: boolean;
  error: string | null;
  permissions: string[];
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const hasCheckedAuth = useRef(false);
  
  const [user, setUser] = useState<any | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isLoading, setIsLoading] = useState(false); 
  const [error, setError] = useState<string | null>(null);
  const [permissions, setPermissions] = useState<string[]>([]);

  useEffect(() => {
    if (hasCheckedAuth.current) return;
    hasCheckedAuth.current = true;

    const checkAuth = async () => {
      setIsCheckingAuth(true);
      try {
        const userData = await AuthService.getProfile(); 
        setUser(userData);
        setIsAuthenticated(true);
        
        // Extraer permisos de los roles
        const userPermissions = extractPermissions(userData);
        setPermissions(userPermissions);
      } catch (error) {
        setUser(null);
        setIsAuthenticated(false);
        setPermissions([]);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuth();
  }, []);

  const extractPermissions = (userData: any): string[] => {
    if (!userData?.roles) return [];
    
    const permissionsSet = new Set<string>();
    userData.roles.forEach((role: any) => {
      if (role.permissions) {
        role.permissions.forEach((permission: string) => {
          permissionsSet.add(permission);
        });
      }
    });
    
    return Array.from(permissionsSet);
  };

  const hasPermission = (permission: string): boolean => {
    return permissions.includes(permission);
  };

  const hasAnyPermission = (requiredPermissions: string[]): boolean => {
    return requiredPermissions.some(p => permissions.includes(p));
  };

  const login = async (data: LoginRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      await AuthService.login(data);
      const userData = await AuthService.getProfile();
      setUser(userData);
      setIsAuthenticated(true);
      
      const userPermissions = extractPermissions(userData);
      setPermissions(userPermissions);
      
      router.push('/dashboard');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al iniciar sesión';
      setError(message);
      throw error; 
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      await AuthService.register(data);
      router.push('/login');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al registrarse';
      setError(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await AuthService.logout();
      setUser(null);
      setIsAuthenticated(false);
      setPermissions([]);
      router.push('/login');
    } catch (error) {
      console.error('Logout error', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      isCheckingAuth, 
      isLoading, 
      error, 
      permissions,
      hasPermission,
      hasAnyPermission,
      login, 
      register, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
}
