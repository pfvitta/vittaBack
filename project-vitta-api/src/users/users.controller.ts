import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  NotFoundException,
  Post,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateAccountDto } from '../common/dtos/createAccount.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Put(':id/status')
  cambioStatus(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.cambioStatus(id);
  }

  @Get()
  getUsers() {
    return this.usersService.getUsers();
  }

  // 🟢 RUTA DE EMAIL ANTES DE LA DE ID
  @Get('exists/:email')
  async userExists(@Param('email') email: string) {
    const exists = await this.usersService.getUserByEmail(email);
    if (!exists) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return { exists: true };
  }

  @Get('by-email/:email')
  async getUserByEmail(@Param('email') email: string) {
    const user = await this.usersService.getUserByEmail(email);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return user;
  }

  @Post('register')
  async createUser(@Body() user: CreateAccountDto) {
      const newUser = await this.usersService.createUser(user);
  return {
    message: 'Usuario creado exitosamente',
    user: newUser,
  };
  }

  // 🛑 ESTA RUTA DEBE IR AL FINAL
  @Get(':id')
  getUsersById(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.getUsersById(id);
  }
}