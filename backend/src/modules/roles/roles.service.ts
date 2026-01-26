import { Inject, Injectable } from "@nestjs/common";
import { FindOneOptions, Repository } from "typeorm";
import { Role } from "./entities/role.entity";
import { RoleDto } from "./dtos/role.dto";
import { RolesMapper } from "./mappers/roles.mapper";


@Injectable()
export class RolesService {
  constructor(
    @Inject('ROLE_REPOSITORY')
    private rolesRepository: Repository<Role>,
  ) {}

    /** Obtiene todos los roles */
    async findAll(): Promise<RoleDto[]> {
        const roles = await this.rolesRepository.find({ relations: ['permissions'] });
        return roles.map(role => RolesMapper.toRoleDTO(role));
    }

    /** Obtiene un rol por filtros */
    async findOne(filters: FindOneOptions<Role>): Promise<RoleDto | null> {
        const role = await this.rolesRepository.findOne({ 
            ...filters,
            relations: ['permissions']
        });
        return role ? RolesMapper.toRoleDTO(role) : null;
    }

    /** Crea un nuevo rol */
    async create(roleData: Partial<Role>): Promise<RoleDto> {
        const newRole = this.rolesRepository.create(roleData);
        const savedRole = await this.rolesRepository.save(newRole);
        return RolesMapper.toRoleDTO(savedRole);
    }

    /** Actualiza un rol existente */
    async update(id: string, roleData: Partial<Role>): Promise<RoleDto> {
        const role = await this.rolesRepository.findOne({ where: { id } });
        if (!role) {
            throw new Error(`Role with ID ${id} not found`);
        }
        this.rolesRepository.merge(role, roleData);
        const updatedRole = await this.rolesRepository.save(role);
        return RolesMapper.toRoleDTO(updatedRole);
    }

    /** Elimina un rol por ID */
    async delete(id: string): Promise<void> {
        await this.rolesRepository.delete(id);
    }

    /** Obtiene un rol por nombre */
    async findByName(name: string): Promise<RoleDto | null> {
        const role = await this.rolesRepository.findOne({ 
          where: { name },
          relations: ['permissions']
        });
        return role ? RolesMapper.toRoleDTO(role) : null;
    }


}