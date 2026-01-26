import { Module } from "@nestjs/common";
import { DatabaseModule } from "src/database/database.module";
import { refreshTokenProviders } from "./refresh-token.providers";
import { RefreshTokenService } from "./refresh-token.service";

@Module({
    imports: [DatabaseModule],
    providers: [
        ...refreshTokenProviders,
        RefreshTokenService
    ],
    exports: [RefreshTokenService]
})
export class RefreshTokenModule {}