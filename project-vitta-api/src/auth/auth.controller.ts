import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAccountDto } from '../common/dtos/createAccount.dto';
import { UsersService } from 'src/users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('signup')
  async signup(@Body() createUser: CreateAccountDto) {
    return await this.usersService.createUser(createUser);
  }

  @Post('signin')
  async signin(@Body() loginUser: CreateAccountDto) {
    return await this.authService.signin(loginUser);
  }
}
