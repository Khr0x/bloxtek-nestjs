import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles && !requiredPermissions) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    if (!user || !user.roles) {
      return false;
    }

    if (requiredRoles) {
      const userRoleNames = user.roles.map((r) => r.name);
      const hasRole = requiredRoles.some((role) => userRoleNames.includes(role));
      if (!hasRole) return false;
    }

   if (requiredPermissions) {
      const userPermissions = user.roles.flatMap((r) => r.permissions || []);
      
      const hasPermission = requiredPermissions.some((perm) => userPermissions.includes(perm));
      if (!hasPermission) return false;
    }

    return true;
  }
}