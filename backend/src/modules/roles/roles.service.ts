import { Inject, Injectable } from "@nestjs/common";
import { FindOneOptions, Repository } from "typeorm";
import { Role } from "./entities/role.entity";


@Injectable()
export class RolesService {
  constructor(
    @Inject('ROLE_REPOSITORY')
    private rolesRepository: Repository<Role>,
  ) {}

    async findAll(): Promise<Role[]> {
        return this.rolesRepository.find({ relations: ['permissions'] });
    }

    async findOne(filters: FindOneOptions<Role>): Promise<Role | null> {
        return this.rolesRepository.findOne({ 
            ...filters,
            relations: ['permissions']
        });
    }

    async create(roleData: Partial<Role>): Promise<Role> {
        const newRole = this.rolesRepository.create(roleData);
        return this.rolesRepository.save(newRole);
    }

    async update(id: string, roleData: Partial<Role>): Promise<Role> {
        const role = await this.rolesRepository.findOne({ where: { id } });
        if (!role) {
            throw new Error(`Role with ID ${id} not found`);
        }
        this.rolesRepository.merge(role, roleData);
        return this.rolesRepository.save(role);
    }

    async delete(id: string): Promise<void> {
        await this.rolesRepository.delete(id);
    }

    async findByName(name: string): Promise<Role | null> {
    return this.rolesRepository.findOne({ 
      where: { name },
      relations: ['permissions']
    });
  }


}