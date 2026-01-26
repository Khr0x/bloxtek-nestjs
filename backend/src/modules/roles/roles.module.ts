import { Module } from "@nestjs/common";
import { DatabaseModule } from "../../database/database.module";
import { roleProviders } from "./roles.providers";
import { RolesService } from "./roles.service";
import { RolesController } from "./roles.controller";

@Module({
  imports: [DatabaseModule],
  controllers: [RolesController],
  providers: [
    ...roleProviders,
    RolesService,
  ],
  exports: [RolesService]
})
export class RolesModule {}