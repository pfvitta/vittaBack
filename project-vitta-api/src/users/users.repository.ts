import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAccountDto } from '../common/dtos/createAccount.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../common/entities/users.entity';
import { ProfessionalProfile } from '../common/entities/professionalProfile.entity';
import { Specialty } from '../common/entities/specialty.entity';
import * as bcrypt from 'bcrypt';
import { envioConfirmacion } from '../helper/serviceMail/serviceMail';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(ProfessionalProfile)
    private readonly professionalProfileRepository: Repository<ProfessionalProfile>,
    @InjectRepository(Specialty)
    private readonly specialtyRepository: Repository<Specialty>,
  ) {}

  async cambioStatus(id: string) {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new BadRequestException('Usuario no encontrado');
    }
    user.status === 'Active'
      ? (user.status = 'Inactive')
      : (user.status = 'Active');
    await this.usersRepository.save(user);
    return 'Usuario actualizado correctamente';
  }

  async getUsers(): Promise<Omit<User, 'password'>[]> {
    const users = await this.usersRepository.find({
      relations: [
        'professionalProfile',
        'professionalProfile.specialty',
        'membership',
        'file',
        'appointments',
      ],
    });

    const usersWithoutPassword = users.map((user) => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });

    return usersWithoutPassword;
  }

  async getUsersById(id: string): Promise<Omit<User, 'password'>> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: [
        'professionalProfile',
        'professionalProfile.specialty',
        'membership',
        'file',
        'appointments',
      ],
    });

    if (!user) {
      throw new BadRequestException('Usuario no encontrado');
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return await this.usersRepository.findOne({
      where: { email },
      relations: ['membership'],
    });
  }

  async createUser(users: any): Promise<any> {
    if (users.role === undefined) users = users.user;

    const existeEmail = await this.usersRepository.findOne({
      where: { email: users.email },
    });
    if (existeEmail) return;

    // se comenta por motivos de que al crear un usuario con rol 'user' se envia el mismo DNI

    /**    const existeDni = await this.usersRepository.findOne({
      where: { dni: users.dni },
    });
    if (existeDni) return; */

    const hashedPassword = await bcrypt.hash(users.password, 10);

    if (!hashedPassword) {
      throw new BadRequestException(
        'Error al crear usuario. Intente nuevamente.',
      );
    }

    let colocarStatus = 'Inactive';
    if (users.role !== 'provider') colocarStatus = 'Active';

    const user: any = {
      name: users.name,
      email: users.email,
      password: users.password,
      phone: users.phone,
      dni: users.dni,
      city: users.city,
      dob: users.dob || new Date(),
      createdAt: new Date(),
      status: colocarStatus,
      role: users.role,
    };

    const savedUser = await this.usersRepository.save({
      ...user,
      password: hashedPassword,
    });

    if (users.role === 'provider') {
      const userprof = await this.usersRepository.findOne({
        where: { email: users.email },
        select: ['id'],
      });

      if (!userprof) {
        throw new BadRequestException(
          'Error al crear perfil profesional. Usuario no encontrado',
        );
      }

      if (!Array.isArray(users.specialty) || users.specialty.length === 0) {
        throw new BadRequestException(
          'Profesional debe tener al menos una especialidad',
        );
      }

      const specialtyIds: Specialty[] = [];
      for (const specialtyName of users.specialty) {
        const specialty = await this.specialtyRepository.findOne({
          where: { name: specialtyName.toUpperCase() },
        });
        if (!specialty) {
          throw new BadRequestException(
            `Especialidad no encontrada: ${specialtyName}`,
          );
        }
        specialtyIds.push(specialty);
      }

      const profesionalProfile: any = {
        biography: users.biography || '',
        experience: users.experience || '',
        verified: false,
        licenseNumber: users.licenseNumber,
        specialty: specialtyIds,
        user: savedUser,
      };

      await this.professionalProfileRepository.save(profesionalProfile);
    }

    if (users.role === 'provider') {
      await envioConfirmacion('welcomeProvider', users.email);
    } else {
      await envioConfirmacion('welcomeUser', users.email);
    }

    const { password, ...userWithoutPassword } = users;
    return userWithoutPassword;
  }
}
