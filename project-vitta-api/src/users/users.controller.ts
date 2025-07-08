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

  @Get(':id')
  getUsersById(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.getUsersById(id);
  }

  @Post('register')
  createUser(@Body() user: CreateAccountDto) {
    return this.usersService.createUser(user);
  }

  // GET /users/exists/:email
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
}
