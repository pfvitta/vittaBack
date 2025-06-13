import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateUsersDto } from "./dtos/CreateUsers.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../common/entities/users.entity";
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersRepository {
    
    constructor(
        @InjectRepository(User) private readonly usersRepository: Repository<User>
    ) {}
    
    async getUsers(): Promise<Omit<User, "password">[]> {
        const users = await this.usersRepository.find();
        const usersWithoutPassword = users.map(user => {
            const { password, ...userWithoutPassword } = user; // Excluir el campo 'password'
            return userWithoutPassword;
        });
        return usersWithoutPassword;
    }

    async getUsersById(id: string): Promise<string | Omit<User, 'password'>> {
        
        const user = await this.usersRepository.findOne({
            where: { id },
            //relations: ['']
        });

        if (user) {
          const { password, ...userWithoutPassword } = user; // Excluir el campo 'password'
            return userWithoutPassword;
        }        
        return 'User not found';
    }

    async createUser(users: CreateUsersDto): Promise<string | Omit<CreateUsersDto, "password">> {
        const existe = await this.usersRepository.findOne({
            where: { email: users.email }
        });
        if (existe) {
            throw new BadRequestException('Este email ya está en uso');
        }
        const hashedPassword = await bcrypt.hash(users.password, 10);
        if (!hashedPassword) {
            throw new BadRequestException('Error al tratar de crear el usuario. Intente nuevamente');
        }
        
        await this.usersRepository.save({ ...users, password: hashedPassword});

        const { password, ...userWithoutPassword } = users;
        return userWithoutPassword;
    }


}