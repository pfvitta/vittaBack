import { Injectable } from '@nestjs/common';
import { CreateAccountDto } from '../common/dtos/createAccount.dto';

@Injectable()
export class AuthService {
  async signup(createUser: CreateAccountDto) {}
}
