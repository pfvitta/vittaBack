import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUsersDto } from './dtos/CreateUsers.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getUsers() {
  return this.usersService.getUsers();
  }

  @Post('register')
  createUser(@Body() user: CreateUsersDto) {
    return this.usersService.createUser(user);
  }
}
