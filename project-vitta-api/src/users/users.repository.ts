import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAccountDto } from '../common/dtos/createAccount.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../common/entities/users.entity';
import * as bcrypt from 'bcrypt';
import { ProfessionalProfile } from 'src/common/entities/professionalProfile.entity';
import { CreateUserDto } from '../common/dtos/createUser.dto';
import { CreateProfessionalProfileDto } from '../common/dtos/createProfessionalProfile.dto';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    @InjectRepository(ProfessionalProfile)
    private readonly professionalProfileRepository: Repository<ProfessionalProfile>,
  ) {}

  async getUsers(): Promise<Omit<User, 'password'>[]> {
    const users = await this.usersRepository.find();
    const usersWithoutPassword = users.map((user) => {
      const { password, ...userWithoutPassword } = user; // Excluir el campo 'password'
      return userWithoutPassword;
    });
    return usersWithoutPassword;
  }

  async getUsersById(id: string): Promise<string | Omit<User, 'password'>> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['professionalProfile'], // Asegurarse de incluir la relación con el perfil profesional si es necesario
    });

    if (user) {
      const { password, ...userWithoutPassword } = user; // Excluir el campo 'password'
      return userWithoutPassword;
    }
    return 'User not found';
  }

  // Crea un usuario en general y si es profesional, crea su perfil profesional
  async createUser(
    users: CreateAccountDto,
  ): Promise<string | Omit<CreateAccountDto, 'password'>> {
    const existe = await this.usersRepository.findOne({
      where: { email: users.email },
    });
    if (existe) {
      throw new BadRequestException('Este email ya está en uso');
    }
    const hashedPassword = await bcrypt.hash(users.password, 10);
    if (!hashedPassword) {
      throw new BadRequestException(
        'Error al tratar de crear el usuario. Intente nuevamente',
      );
    }

    const user: CreateUserDto = {
      name: users.name,
      email: users.email,
      password: users.password,
      phone: users.phone,
      dni: users.dni,
      city: users.city,
      dob: users.dob,
      role: users.role,
    };

    // Guardar el usuario en la base de datos
    await this.usersRepository.save({ ...user, password: hashedPassword });

    // Si el usuario es profesional, guardar su perfil profesional
    if (users.role === 'profesional') {
      const profesionalProfile: CreateProfessionalProfileDto = {
        biography: users.biography || '', // Asignar un valor por defecto si es undefined
        experience: users.experience || '', // Asignar un valor por defecto si es undefined
        licenseNumber: users.licenseNumber,
        specialty: users.specialty,
      };
      await this.professionalProfileRepository.save(profesionalProfile);
    }

    // Excluir el campo 'password' del objeto de usuario
    const { password, ...userWithoutPassword } = users;
    return userWithoutPassword;
  }
}
