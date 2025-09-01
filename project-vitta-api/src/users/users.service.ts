import { Injectable } from '@nestjs/common';
import { CreateAccountDto } from '../common/dtos/createAccount.dto';
import { UsersRepository } from './users.repository';
import { User } from '../common/entities/users.entity';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  getUsersById(id: string) {
    return this.usersRepository.getUsersById(id);
  }

  getUsers() {
    return this.usersRepository.getUsers();
  }

  cambioStatus(id: string) {
    return this.usersRepository.cambioStatus(id);
  }

  createUser(user: CreateAccountDto) {
    console.log('llega al service', user);
    return this.usersRepository.createUser(user);
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.usersRepository.getUserByEmail(email);
  }
}
