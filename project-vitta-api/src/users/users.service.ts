import { Injectable } from '@nestjs/common';
import { CreateUsersDto } from './dtos/CreateUsers.dto';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {

        constructor(private usersRepository: UsersRepository) {}  

    createUser(user: CreateUsersDto) {
        return this.usersRepository.createUser(user);
    }
}
