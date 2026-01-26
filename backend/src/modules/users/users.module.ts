import { Module } from "@nestjs/common";
import { DatabaseModule } from "../../database/database.module";
import { UsersController } from "./users.controller";
import { userProviders } from "./users.providers";
import { UsersService } from "./users.service";
import { RolesModule } from "../roles/roles.module";

@Module({
  imports: [DatabaseModule, RolesModule],
  controllers: [UsersController],
  providers: [
    ...userProviders,
    UsersService,
  ],
  exports: [UsersService]
})
export class UsersModule {}