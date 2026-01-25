import { api } from '@/lib/axios';
import { User } from '@/types';

export class UserService {
  private static readonly BASE_PATH = '/api/v1/users';


  static async findAll(): Promise<User[]> {
    try {
        const response = await api.get<User[]>(`${this.BASE_PATH}`);
        return response.data;
    } catch (error) {
        return Promise.reject(error);
    }
  }


static async findById(id: string): Promise<User> {
    try {
        const response = await api.get<User>(`${this.BASE_PATH}/${id}`);
        return response.data;
    } catch (error) {
        return Promise.reject(error);
    }
  }

  static async create(user: User): Promise<User> {
    try {
        const response = await api.post<User>(`${this.BASE_PATH}`, user);
        return response.data;
    } catch (error) {
        return Promise.reject(error);
    }
  }

  static async update(id: string, user: Partial<User>): Promise<User> {
    try {
        const response = await api.patch<User>(`${this.BASE_PATH}/${id}`, user);
        return response.data;
    } catch (error) {
        return Promise.reject(error);
    }
  }

  static async delete(id: string): Promise<void> {
    try {
        await api.delete<void>(`${this.BASE_PATH}/${id}`);
    } catch (error) {
        return Promise.reject(error);
    }
  }

}