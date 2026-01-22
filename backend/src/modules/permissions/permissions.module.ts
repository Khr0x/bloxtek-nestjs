import { Module } from "@nestjs/common";
import { DatabaseModule } from "src/database/database.module";
import { permissionProviders } from "./permissions.providers";
import { PermissionsService } from "./permissions.service";

@Module({
  imports: [DatabaseModule],
//   controllers: [PermissionsController],
  providers: [
    ...permissionProviders,
    PermissionsService,
  ],
  exports: [PermissionsService]
})
export class PermissionsModule {}