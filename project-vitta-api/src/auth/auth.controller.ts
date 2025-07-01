import { Body, Controller, Post } from '@nestjs/common';

import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { UserCredentialDto } from '../common/dtos/userCredential.dto';


@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}


  @Post('signup')
  async signup(@Body() createUser: any) {
    return await this.usersService.createUser(createUser); 
  }

  @Post('signin')
  async signin(@Body() loginUser: UserCredentialDto) {
    return await this.authService.signin(loginUser);
  }
}
