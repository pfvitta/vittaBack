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
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Put(':id/status')
  @ApiOperation({
    summary: 'Cambiar estado de un usuario',
    description: 'Activa o desactiva un usuario según su UUID.',
  })
  cambioStatus(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.cambioStatus(id);
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener todos los usuarios',
    description: 'Retorna la lista completa de usuarios registrados.',
  })
  getUsers() {
    return this.usersService.getUsers();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener usuario por ID',
    description: 'Busca un usuario usando su ID (UUID) y retorna sus datos.',
  })
  getUsersById(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.getUsersById(id);
  }

  @Post('register')
  @ApiOperation({
    summary: 'Registrar un nuevo usuario',
    description: 'Crea un nuevo usuario a partir de los datos proporcionados.',
  })
  createUser(@Body() user: CreateAccountDto) {
    return this.usersService.createUser(user);
  }

  // GET /users/exists/:email
  @Get('exists/:email')
  @ApiOperation({
    summary: 'Verificar existencia de usuario por email',
    description:
      'Retorna true si un usuario existe con ese email, o lanza un error si no.',
  })
  async userExists(@Param('email') email: string) {
    const exists = await this.usersService.getUserByEmail(email);
    if (!exists) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return { exists: true };
  }

  @Get('by-email/:email')
  @ApiOperation({
    summary: 'Obtener usuario por email',
    description:
      'Busca un usuario por su correo electrónico y retorna su información.',
  })
  async getUserByEmail(@Param('email') email: string) {
    const user = await this.usersService.getUserByEmail(email);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return user;
  }
}
