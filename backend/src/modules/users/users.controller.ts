import { 
  Controller, Get, Post, Body, Patch, Param, Delete, 
  UseInterceptors, ClassSerializerInterceptor, ParseUUIDPipe, 
  UseGuards
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AuthGuard } from '../../common/guards/auth.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';

@Controller('api/v1/users')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard, AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Permissions('users:create')
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @Get()
  @Permissions('users:read')
  async findAll() {
    return await this.usersService.findAll();
  }

  @Get(':id')
  @Permissions('users:read')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.usersService.findOne({ where: { id, isActive: true } });
  }

  @Patch(':id')
  @Permissions('users:update')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Permissions('users:delete')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return await this.usersService.delete(id);
  }
}