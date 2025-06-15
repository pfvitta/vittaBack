import { Injectable } from '@nestjs/common';
import { CreateAccountDto } from '../common/dtos/createAccount.dto';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  getUsersById(id: string) {
    return this.usersRepository.getUsersById(id);
  }

  getUsers() {
    return this.usersRepository.getUsers();
  }

  async createUser(user: CreateAccountDto) {
    return this.usersRepository.createUser(user);
  }
}
