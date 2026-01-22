import { Controller, Post, Body, UseGuards, Request, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from '../../common/guards/local-auth.guard'; 
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { LoginDto } from './dtos/login.dto';
import { CreateUserDto } from '../users/dtos';
import { AuthGuard } from '../../common/guards/auth.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: any, @Body() loginDto: LoginDto) {
    return this.authService.login(req.user);
  }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Request() req: any) {
    const userId = req.user.id;
    const user = await this.authService.me(userId);
    return {
      id: user.id,
      name: user.name,
      email: user.email
    };
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