import { Controller, Post, Body, UseGuards, Request, Get, HttpCode, Res, Req, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from '../../common/guards/local-auth.guard'; 
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { LoginDto } from './dtos/login.dto';
import { CreateUserDto } from '../users/dtos';
import { AuthGuard } from '../../common/guards/auth.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { ConfigService } from '@nestjs/config/dist/config.service';
import type { Response } from 'express';

@Controller('api/v1/auth')
export class AuthController {
  constructor(
    private authService: AuthService, 
    private configService: ConfigService
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: any, @Body() loginDto: LoginDto,  @Res({ passthrough: true }) response: Response) {
    const authResult = await this.authService.login(req.user);

    const isProduction = this.configService.get('NODE_ENV') === 'production';
    const cookieDomain = this.configService.get('COOKIE_DOMAIN');

    const cookieOptions = {
      httpOnly: true, 
      secure: isProduction, 
      sameSite: isProduction ? 'strict' as const : 'lax' as const, 
      maxAge: 15 * 60 * 1000,
      domain: cookieDomain || undefined,
      path: '/',
    };

    response.cookie('access_token', authResult.accessToken, cookieOptions);

     response.cookie('refresh_token', authResult.refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return {  message: 'Login successful' };

  }

  @Post('register')
  @HttpCode(201)
  async register(@Body() createUserDto: CreateUserDto) {
    await this.authService.register(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Request() req: any) {
    return req.user;
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req: any, @Res({ passthrough: true }) response: Response) {
    response.clearCookie('access_token');
    response.clearCookie('refresh_token');
    await this.authService.logout(req.user.id);
    return { message: 'Logout successful' };
  }

  @Post('refresh')
  async refresh(
    @Request() req: any,
    @Res({ passthrough: true }) response: Response,
  ) {
    const oldRefreshToken = req.cookies['refresh_token'];
    
    if (!oldRefreshToken) {
      throw new UnauthorizedException('No refresh token found');
    }

    try {
        const { accessToken, refreshToken } = await this.authService.refresh(oldRefreshToken);
    
        const isProduction = this.configService.get('NODE_ENV') === 'production';
        const cookieDomain = this.configService.get('COOKIE_DOMAIN');

        const cookieOptions = {
          httpOnly: true, 
          secure: isProduction, 
          sameSite: isProduction ? 'strict' as const : 'lax' as const, 
          maxAge: 15 * 60 * 1000,
          domain: cookieDomain || undefined,
          path: '/',
        };

      response.cookie('access_token', accessToken, cookieOptions);

      response.cookie('refresh_token', refreshToken, {
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

    return { message: 'Token refreshed' };  
    } catch (error) {
      response.clearCookie('access_token');
      response.clearCookie('refresh_token');
      throw new UnauthorizedException('Invalid refresh token');
    }

  }

 
  @Get('me-admin')
  @UseGuards(JwtAuthGuard, AuthGuard)
  @Roles('ADMIN')
  async getProfileAdmin(@Request() req: any) {
    const userId = req.user.id;
    const user = await this.authService.me(userId);
    return {
      id: user.id,
      name: user.name,
      email: user.email
    };
  }
}