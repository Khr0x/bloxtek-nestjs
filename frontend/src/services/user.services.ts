import { api } from '@/lib/axios';
import { CreateUser, UpdateUser, User } from '@/types';

export class UserService {
  private static readonly BASE_PATH = '/api/v1/users';

    /** 
   * Obtener todos los usuarios
   */
  static async findAll(params?: { isActive?: boolean }): Promise<User[]> {
    try {
        const response = await api.get<User[]>(`${this.BASE_PATH}`, { params });
        return response.data;
    } catch (error) {
        return Promise.reject(error);
    }
  }

    /** 
   * Obtener un usuario por ID
   */
static async findById(id: string): Promise<User> {
    try {
        const response = await api.get<User>(`${this.BASE_PATH}/${id}`);
        return response.data;
    } catch (error) {
        return Promise.reject(error);
    }
  }

  /**
   * Crear un nuevo usuario
   * @param user Datos del usuario a crear
   * @returns Usuario creado
   */
  static async create(user: CreateUser): Promise<User> {
    try {
        const response = await api.post<User>(`${this.BASE_PATH}`, user);
        return response.data;
    } catch (error) {
        return Promise.reject(error);
    }
  }

  /** 
   * Actualizar un usuario existente
   * @param id ID del usuario a actualizar
   * @param user Datos del usuario a actualizar
   * @returns Usuario actualizado
   */
  static async update(id: string, user: UpdateUser): Promise<User> {
    try {
        const response = await api.patch<User>(`${this.BASE_PATH}/${id}`, user);
        return response.data;
    } catch (error) {
        return Promise.reject(error);
    }
  }

  /** 
   * Eliminar un usuario por ID
   * @param id ID del usuario a eliminar
   */
  static async delete(id: string): Promise<void> {
    try {
        await api.delete<void>(`${this.BASE_PATH}/${id}`);
    } catch (error) {
        return Promise.reject(error);
    }
  }

}