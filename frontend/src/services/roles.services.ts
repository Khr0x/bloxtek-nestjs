import api from "@/lib/axios";
import { Role } from "@/types";

export class RolesService {
  private static readonly BASE_PATH = '/api/v1/roles';

  /** 
   * Obtener todos los roles
   */
  static async findAll(): Promise<Role[]> {
    try {
        const response = await api.get<Role[]>(`${this.BASE_PATH}`);
        return response.data;
    } catch (error) {
        return Promise.reject(error);
    }
  }


}