import { Injectable } from '@nestjs/common';
import { CreateUsersDto } from './dtos/CreateUsers.dto';
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

  createUser(user: CreateUsersDto) {
    return this.usersRepository.createUser(user);
  }

}
