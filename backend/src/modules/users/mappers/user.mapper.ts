import { RoleDto } from "../../../modules/roles/dtos/role.dto";
import { Role } from "../../../modules/roles/entities/role.entity";
import { CreateUserDto, UserDto, UserFullDto, UserRolesDto } from "../dtos";
import { User } from "../entities/user.entity";


export class UserMapper {

    static toDto(user: User): UserDto {
        const userDto = new UserDto();
        userDto.id = user.id;
        userDto.name = user.name;
        userDto.email = user.email;
        userDto.isActive = user.isActive;
        userDto.createdAt = user.createdAt;
        userDto.updatedAt = user.updatedAt;
        return userDto;
    }

    static toDtoFull(user: User): UserFullDto {
        const userDto = new UserFullDto();
        userDto.id = user.id;
        userDto.name = user.name;
        userDto.email = user.email;
        userDto.password = user.password;
        userDto.isActive = user.isActive;
        userDto.roles = user.roles ? user.roles.map(role => {
            const roleDto = new UserRolesDto();
            roleDto.id = role.id;
            roleDto.name = role.name;
            roleDto.permissions = role.permissions ? role.permissions.map(perm => perm.slug) : [];
            return roleDto;
        }) : [];
        userDto.createdAt = user.createdAt;
        userDto.updatedAt = user.updatedAt;
        return userDto;
    }

    static toEntity(userDto: UserDto, roles: RoleDto[]): User {
        const user = new User();
        user.id = userDto.id;
        user.name = userDto.name;
        user.email = userDto.email;
        user.roles = roles.map(roleDto => {
            const role = new Role();
            role.id = roleDto.id;
            role.name = roleDto.name;
            role.permissions = roleDto.permissions || [];
            return role;
        });
        user.isActive = userDto.isActive;
        user.createdAt = userDto.createdAt;
        user.updatedAt = userDto.updatedAt;
        user.deleted = (userDto as any).deleted;
        user.deletedAt = (userDto as any).deletedAt;
        return user;
    }

    static toEntityFromCreate(userDto: CreateUserDto, roles: RoleDto[]): User {
        const user = new User();
        user.name = userDto.name;
        user.email = userDto.email;
        user.password = userDto.password;
        user.roles = roles.map(roleDto => {
            const role = new Role();
            role.id = roleDto.id;
            role.name = roleDto.name;
            role.permissions = roleDto.permissions;
            return role;
        });
        return user;
    }
}