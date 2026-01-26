import { RoleDto } from "../dtos/role.dto";
import { Role } from "../entities/role.entity";

export class RolesMapper {
    
  static toRoleDTO(role: Role): RoleDto {
    return {
      id: role.id,
      name: role.name,
      description: role.description,
      permissions: role.permissions.map((permission: any) => ({
        id: permission.id,
        slug: permission.slug,
        description: permission.description
      })),
    };
  }
}