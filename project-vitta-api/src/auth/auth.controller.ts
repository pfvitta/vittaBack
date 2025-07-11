import { Body, Controller, Post } from '@nestjs/common';

import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { UserCredentialDto } from '../common/dtos/userCredential.dto';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  /**
   * Registra un nuevo usuario.
   * @param createUser - DTO con nombre, correo y contraseña.
   * @returns El usuario creado.
   */
  @Post('signup')
  @ApiOperation({
    summary: 'Registro de usuario',
    description:
      'Crea un nuevo usuario con nombre, correo electrónico y contraseña.',
  })
  async signup(@Body() createUser: any) {
    return await this.usersService.createUser(createUser);
  }

  /**
   * Inicia sesión con correo y contraseña.
   * @param loginUser - DTO con email y password.
   * @returns Token JWT y datos del usuario autenticado.
   */
  @Post('signin')
  @ApiOperation({
    summary: 'Inicio de sesión',
    description:
      'Permite iniciar sesión con correo y contraseña. Retorna un JWT válido si las credenciales son correctas.',
  })
  @ApiBody({ type: UserCredentialDto })
  async signin(@Body() loginUser: UserCredentialDto) {
    return await this.authService.signin(loginUser);
  }

  /**}
function ApiOperation(arg0: { summary: string; description: string; }): (target: AuthController, propertyKey: "signup", descriptor: TypedPropertyDescriptor<(createUser: any) => Promise<any>>) => void | TypedPropertyDescriptor<...> {
  throw new Error('Function not implemented.');
}

function ApiBody(arg0: { type: any; }): (target: AuthController, propertyKey: "signup", descriptor: TypedPropertyDescriptor<(createUser: any) => Promise<any>>) => void | TypedPropertyDescriptor<...> {
  throw new Error('Function not implemented.'); */
}
