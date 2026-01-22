export class RefreshTokenPayloadDto {
  id: string;
  token: string;
  userId: string;
  userEmail: string;
  userRoles: string[];
  expiresAt: Date;
  revoked: boolean;
}