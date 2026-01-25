import { api } from '@/lib/axios';
import type { LoginRequest, LoginResponse, RegisterRequest, UserProfile } from '@/types';

export class AuthService {
  private static readonly BASE_PATH = '/api/v1/auth';

  
  /**
   * Iniciar sesión
   */
  static async login(data: LoginRequest): Promise<LoginResponse> {
    try {
        const response = await api.post<LoginResponse>(`${this.BASE_PATH}/login`, data);
        return response.data;
    } catch (error) {
        return Promise.reject(error);
    }
  }

  /**
   * Registrar nuevo usuario
   */
  static async register(data: RegisterRequest): Promise<boolean> {
    const response = await api.post<void>(`${this.BASE_PATH}/register`, data);
    return response.status === 201;
  }

   static async getProfile(): Promise<UserProfile> {
        const response = await api.get<UserProfile>(`${this.BASE_PATH}/me`);
        return response.data;
    }

    /**
     * Cerrar sesión
     */
  static async logout(): Promise<void> {
    await api.post(`${this.BASE_PATH}/logout`);
  }

   /**
   * Renovar access token
   */
  static async refreshToken(): Promise<void> {
    await api.post<{ accessToken: string }>(`${this.BASE_PATH}/refresh`);
  }

   /**
   * Verificar si el usuario está autenticado
   */
    static async isAuthenticated(): Promise<boolean> {
    try {
      await this.getProfile();
      return true;
    } catch {
      return false;
    }
  }


}