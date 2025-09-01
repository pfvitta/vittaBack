import { Body, Controller, Post } from '@nestjs/common';
import { AdminService } from './admin.service';
import { UserCredentialDto } from '../common/dtos/userCredential.dto';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  /**
   * Inicia sesión como administrador.
   *
   * @param loginUser - DTO con las credenciales del usuario (email y password).
   * @returns Objeto con el token JWT y datos básicos del administrador autenticado.
   */
  @Post('login')
  @ApiOperation({
    summary: 'Inicio de sesión de administrador',
    description:
      'Valida las credenciales del administrador y devuelve un JWT si son correctas.',
  })
  @ApiBody({ type: UserCredentialDto })
  async signin(@Body() loginUser: UserCredentialDto) {
    console.log('Login controller:', loginUser);
    return await this.adminService.signin(loginUser);
  }
}
