import { Body, Controller, Post } from '@nestjs/common';
import { AdminService } from './admin.service';
import { UserCredentialDto } from '../common/dtos/userCredential.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('login')
  async signin(@Body() loginUser: UserCredentialDto) {
    console.log('Login controller:', loginUser);
    return await this.adminService.signin(loginUser);
  }
}
