import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users/users.service";
import { RefreshTokenService } from "./services/refresh-token.service";
import { comparePassword, genSalt, hash } from "../../common/utils/hash.utils";
import { CreateUserDto } from "../users/dtos";


@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private refreshTokenService: RefreshTokenService,
  ) {}

  /**
   * Valida las credenciales de un usuario
   * @param email - Email del usuario
   * @param pass - Contraseña en texto plano
   * @returns Usuario si las credenciales son válidas, null si no
   */
  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    if (user && await comparePassword(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  /**
   * Realiza el login de un usuario y genera los tokens
   * @param user - Usuario autenticado
   * @returns Tokens de acceso y refresh
   */
  async login(user: any) {
    const payload = { 
      sub: user.id, 
      email: user.email,
      name: user.name, 
      roles: user.roles.map(role => ({
        name: role.name,
        permissions: role.permissions
      }))
    };
    
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = await this.generateRefreshToken(user.id);

    return {
      accessToken,
      refreshToken
    };
  }

  /**
   * Registra un nuevo usuario
   * @param createUserDto - Datos para crear el usuario
   */
  async register(createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  /**
   * Obtiene la información del usuario actual
   * @param userId - ID del usuario
   * @returns Información del usuario
   */
  async me(userId: string) {
    const user = await this.usersService.findOne({ 
      where: { id: userId },
      relations: ['roles', 'roles.permissions'] 
    });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }

  /**
   * Genera un nuevo refresh token para un usuario
   * @param userId - ID del usuario
   * @returns Token de refresh generado
   */
  private async generateRefreshToken(userId: string): Promise<string> {
    const token = await genSalt(20);
    const hashedToken = await hash(token, 10);

    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 7);

    await this.refreshTokenService.create(
      userId,
      hashedToken,
      expiryDate
    );

    return token;
  }

  /**
   * Refresca los tokens de acceso y refresh token
   * @param oldToken - Token de refresh antiguo
   * @returns Nuevos tokens de acceso y refresh
   */
  async refresh(oldToken: string) {

     const payload = await this.refreshTokenService.findValidToken(oldToken);
        if (payload) {
        const newAccessToken = this.jwtService.sign({ 
          sub: payload.userId, 
          email: payload.userEmail, 
          roles: payload.userRoles 
        });
      const newRefreshToken = await this.generateRefreshToken(payload.userId);

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    }
    throw new UnauthorizedException('Refresh token logic needs complete implementation'); 
  }

  /**
   * Revoca todos los refresh tokens de un usuario (útil para logout global)
   */
  async logout(userId: string): Promise<void> {
    await this.refreshTokenService.revokeAllUserTokens(userId);
  }



}