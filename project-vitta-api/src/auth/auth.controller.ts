import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAccountDto } from '../common/dtos/createAccount.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() createUser: CreateAccountDto) {
    return await this.authService.signup(createUser);
  }

  @Post('signin')
  async signin(@Body() loginUser: CreateAccountDto) {
    return await this.authService.signin(loginUser);
  }
}
