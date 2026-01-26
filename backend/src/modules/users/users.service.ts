import { Injectable, Inject, BadRequestException, NotFoundException } from '@nestjs/common';
import { FindOneOptions, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { hashPassword } from "../../common/utils/hash.utils";
import { CreateUserDto, UpdateUserDto, UserDto, UserFullDto } from './dtos';
import { UserMapper } from './mappers/user.mapper';
import { RolesService } from '../roles/roles.service';
import { RoleDto } from '../roles/dtos/role.dto';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,
    private readonly rolesService: RolesService,
  ) {}

  /**
   * Servicio para crear un nuevo usuario
   * @param createUserDto Datos para crear el usuario
   * @returns Usuario creado
   */
  async create(createUserDto: CreateUserDto): Promise<UserDto> {
    const { email, password, roleNames, ...rest } = createUserDto;
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new BadRequestException('El correo electrónico ya está registrado');
    }
    const hashedPassword = await hashPassword(password);
    
    let roles: RoleDto[] = [];
    if (roleNames && roleNames.length > 0) {
      for (const roleName of roleNames) {
        const role = await this.rolesService.findOne({ where: { name: roleName } });
        if (!role) {
          throw new BadRequestException(`Rol "${roleName}" no encontrado`);
        }
        roles.push(role);
      }
    } else {
      const defaultRole = await this.rolesService.findOne({ where: { name: 'USER' } });
      if (!defaultRole) {
        throw new BadRequestException('Rol por defecto "USER" no encontrado');
      }
      roles = [defaultRole];
    }
    
    
    const userEntity = UserMapper.toEntityFromCreate({ ...rest, email, password: hashedPassword }, roles);
    const newUser = this.userRepository.create(userEntity);
    const savedUser = await this.userRepository.save(newUser);
    return UserMapper.toDto(savedUser);
  }

  /** Servicio para obtener todos los usuarios activos
   * @returns Lista de usuarios activos
   */
  async findAll(filters: FindOneOptions<UserDto>): Promise<UserFullDto[]> {
    const users = await this.userRepository.find({where: { ...filters.where, deleted: false }, relations: ['roles', 'roles.permissions'] });
    return users.map(user => UserMapper.toDtoFull(user));
  }

  /** Servicio para obtener un usuario por filtros
   * @param filters Filtros para buscar el usuario
   * @returns Usuario encontrado
   */
  async findOne(filters: FindOneOptions<UserDto>): Promise<UserFullDto> {
    const user = await this.userRepository.findOne({ where: { ...filters.where, deleted: false }, relations: filters.relations });

    if (!user) {
      throw new NotFoundException(`Usuario no encontrado`);
    }
    return UserMapper.toDtoFull(user);
  }

  /** Servicio para obtener un usuario por email
   * @param email Email del usuario
   * @returns Usuario encontrado o null
   */
  async findOneByEmail(email: string): Promise<UserFullDto | null> {
     const user = await this.userRepository.findOne({ 
      where: { email, deleted: false },
      relations: ['roles', 'roles.permissions']
    });
    return user ? UserMapper.toDtoFull(user) : null;
  }

  /** Servicio para actualizar un usuario
   * @param id ID del usuario a actualizar
   * @param updateUserDto Datos para actualizar el usuario
   * @returns Usuario actualizado
   */
  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserDto> {
    const user = await this.findOne({ where: { id }, relations: ['roles'] });

    let userRoles: RoleDto[] = [];
    if (updateUserDto.roleNames) {
      const roles: RoleDto[] = [];
      for (const roleName of updateUserDto.roleNames) {
        const role = await this.rolesService.findOne({ where: { name: roleName } });
        if (!role) {
          throw new BadRequestException(`Rol "${roleName}" no encontrado`);
        }
        roles.push(role);
      }
      userRoles = roles;
    }

    const entity = UserMapper.toEntity(user, userRoles.length > 0 ? userRoles : user.roles);
    this.userRepository.merge(entity, updateUserDto);
    
    const updatedUser = await this.userRepository.save(entity);
    return UserMapper.toDto(updatedUser);
  }

  /** Servicio para eliminar (desactivar) un usuario
   * @param id ID del usuario a eliminar
   */
  async delete(id: string): Promise<void> {
    const user = await this.findOne({ where: { id, isActive: true } });
    user.isActive = false;
    user.deleted = true;
    user.deletedAt = new Date();
    const entity = UserMapper.toEntity(user, user.roles);
    await this.userRepository.save(entity);
  }

}