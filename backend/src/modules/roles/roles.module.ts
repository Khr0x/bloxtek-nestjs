import { Module } from "@nestjs/common";
import { DatabaseModule } from "../../database/database.module";
import { roleProviders } from "./roles.providers";
import { RolesService } from "./roles.service";

@Module({
  imports: [DatabaseModule],
//   controllers: [UsersController],
  providers: [
    ...roleProviders,
    RolesService,
  ],
  exports: [RolesService]
})
export class RolesModule {}