import { Injectable, NotFoundException } from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import { UserCredentialDto } from '../common/dtos/userCredential.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
  ) {}

  async signin(credential: UserCredentialDto) {
    // Valida existencia de email
    const validateEmail = await this.authRepository.existsByEmail(
      credential.email,
    );

    if (!validateEmail) {
      throw new NotFoundException('Usuario y Password no son validos');
    }

    // Realiza validacion de la contraseña
    const validatePassword = await bcrypt.compare(
      credential.password,
      validateEmail.password,
    );

    if (!validatePassword) {
      throw new NotFoundException('Usuario y Password no son validos');
    }

    // Genracion del token.

    const userPayload = {
      sub: validateEmail.id,
      id: validateEmail.id,
      email: validateEmail.email,
    };

    const token = this.jwtService.sign(userPayload);

    return { succes: 'User logged in succesfully', token };
  }
}
