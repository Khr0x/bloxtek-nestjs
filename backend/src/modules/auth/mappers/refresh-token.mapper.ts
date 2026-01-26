import { RefreshTokenPayloadDto } from "../dtos/refresh-token-payload.dto";
import { RefreshToken } from "../entities/refresh-token.entity";

export class RefreshTokenMapper {

  static toPayloadDto(entity: RefreshToken): RefreshTokenPayloadDto {
    return {
      id: entity.id,
      token: entity.token,
      userId: entity.user.id,
      userEmail: entity.user.email,
      userRoles: entity.user.roles?.map(r => r.name) || [],
      expiresAt: entity.expiresAt,
      revoked: entity.revoked,
    };
  }
}