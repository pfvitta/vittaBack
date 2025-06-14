import { Injectable } from '@nestjs/common';
import { CreateAccountDto } from '../common/dtos/createAccount.dto';
import { AuthRepository } from './auth.repository';

@Injectable()
export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}

  async signin(createUser: CreateAccountDto) {}
}
