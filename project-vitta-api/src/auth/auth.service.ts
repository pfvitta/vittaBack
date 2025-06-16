import { Injectable } from '@nestjs/common';
import { CreateAccountDto } from '../common/dtos/createAccount.dto';
import { AuthRepository } from './auth.repository';

@Injectable()
export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}
  
  async signin(createUser: CreateAccountDto) {}


//Este código lo cree para que corriera el programa, Camilo puedes borrarlo
  signup(createUser: CreateAccountDto) {
    throw new Error('Method not implemented.');
  }
// --------------------------------------------------------------------------------  
}
