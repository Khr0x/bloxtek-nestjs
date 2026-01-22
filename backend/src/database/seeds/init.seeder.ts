import { Injectable, OnModuleInit, Logger } from "@nestjs/common";
import { Permission } from "../../modules/permissions/entities/permission.entity";
import { PermissionsService } from "../../modules/permissions/permissions.service";
import { RolesService } from "../../modules/roles/roles.service";
import { UsersService } from "../../modules/users/users.service";

@Injectable()
export class InitSeeder implements OnModuleInit {
  private readonly logger = new Logger(InitSeeder.name);

  constructor(
    private rolesService: RolesService,
    private permissionsService: PermissionsService,
    private usersService: UsersService
  ) {}

  async onModuleInit() {
    await this.seed();
  }

  async seed() {
    const permissionsData: Partial<Permission>[] = [
      { slug: 'dashboard:view', description: 'Ver Dashboard' },
      { slug: 'users:read', description: 'Leer Usuarios' },
      { slug: 'users:create', description: 'Crear Usuarios' },
      { slug: 'users:update', description: 'Editar Usuarios' },
      { slug: 'users:delete', description: 'Eliminar Usuarios' },
    ];

    const savedPermissions: Permission[] = [];
    
    for (const p of permissionsData) {
      const existing = await this.permissionsService.findOne({ where: { slug: p.slug } });
      if (!existing) {
        savedPermissions.push(await this.permissionsService.create(p));
      } else {
        savedPermissions.push(existing);
      }
    }

    const getPerms = (slugs: string[]) => savedPermissions.filter(p => slugs.includes(p.slug));

    const rolesData = [
      {
        name: 'ADMIN',
        description: 'Super Administrador',
        permissions: getPerms(['dashboard:view', 'users:read', 'users:create', 'users:update', 'users:delete']),
      },
      {
        name: 'MANAGER',
        description: 'Gestor de Contenido',
        permissions: getPerms(['dashboard:view', 'users:read', 'users:create', 'users:update']),
      },
      {
        name: 'USER',
        description: 'Usuario Estándar',
        permissions: getPerms(['dashboard:view']),
      },
    ];

    for (const r of rolesData) {
      const existingRole = await this.rolesService.findOne({ 
        where: { name: r.name }
      });

      if (!existingRole) {
        await this.rolesService.create(r);
        console.log(`Rol ${r.name} creado.`);
      }
    }

    const adminEmail = process.env.ADMIN_EMAIL || '';
    const adminPassword = process.env.ADMIN_PASSWORD || '';

    try {
        await this.usersService.create({
        name: 'Super Admin',
        email: adminEmail,
        password: adminPassword,
        roleNames: ['ADMIN'],
      });
      this.logger.log(`Usuario administrador creado con email: ${adminEmail} y contraseña: ${adminPassword}`);
    } catch (error) {
       this.logger.log(`El usuario administrador con email: ${adminEmail} ya existe.`);
    }
  }
}