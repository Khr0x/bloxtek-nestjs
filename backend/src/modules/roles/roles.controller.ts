import { ClassSerializerInterceptor, Controller, Get, UseGuards, UseInterceptors } from "@nestjs/common";
import { AuthGuard } from "../../common/guards/auth.guard";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesService } from "./roles.service";
import { Permissions } from "../../common/decorators/permissions.decorator";

@Controller('api/v1/roles')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard, AuthGuard)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  @Permissions('roles:read')
  async findAll() {
    return await this.rolesService.findAll();
  }
  
}