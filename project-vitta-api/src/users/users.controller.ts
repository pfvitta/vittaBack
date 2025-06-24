import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateAccountDto } from '../common/dtos/createAccount.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

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
}
