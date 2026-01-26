import { Inject, Injectable } from "@nestjs/common";
import { Permission } from "./entities/permission.entity";
import { FindOneOptions, Repository } from "typeorm";

@Injectable()
export class PermissionsService {
  constructor(
    @Inject('PERMISSION_REPOSITORY')
    private permissionsRepository: Repository<Permission>,
  ) {}

  /** Obtiene todos los permisos */
  async findAll(): Promise<Permission[]> {
    return this.permissionsRepository.find();
  }
    /** Obtiene un permiso por filtros */
    async findOne(filters: FindOneOptions<Permission>): Promise<Permission | null> {
        return this.permissionsRepository.findOne(filters);
    }
    
    /** Crea un nuevo permiso */
    async create(permissionData: Partial<Permission>): Promise<Permission> {
        const newPermission = this.permissionsRepository.create(permissionData);
        return this.permissionsRepository.save(newPermission);
    }

    /** Actualiza un permiso existente */
    async update(id: string, permissionData: Partial<Permission>): Promise<Permission> {
        const permission = await this.permissionsRepository.findOne({ where: { id } });
        if (!permission) {
            throw new Error(`Permission with ID ${id} not found`);
        }
        this.permissionsRepository.merge(permission, permissionData);
        return this.permissionsRepository.save(permission);
    }

    /** Elimina un permiso por ID */
    async delete(id: string): Promise<void> {
        await this.permissionsRepository.delete(id);
    }

}