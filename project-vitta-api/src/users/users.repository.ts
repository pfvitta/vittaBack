import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAccountDto } from '../common/dtos/createAccount.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../common/entities/users.entity';
import * as bcrypt from 'bcrypt';
import { ProfessionalProfile } from '../common/entities/professionalProfile.entity';
import { Specialty } from '../common/entities/specialty.entity';
import { envioConfirmacion } from '../helper/serviceMail/serviceMail';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    @InjectRepository(ProfessionalProfile)
    private readonly professionalProfileRepository: Repository<ProfessionalProfile>,
    @InjectRepository(Specialty)
    private readonly specialtyRepository: Repository<Specialty>,
  ) {}

  async getUsers(): Promise<Omit<User, 'password'>[]> {
    const users = await this.usersRepository.find({
      relations: [
        'professionalProfile',
        'professionalProfile.specialty',
        'membership',
      ],
    });
    const usersWithoutPassword = users.map((user) => {
      const { password, ...userWithoutPassword } = user; // Excluir el campo 'password'
      return userWithoutPassword;
    });
    return usersWithoutPassword;
  }

  async getUsersById(id: string): Promise<string | Omit<User, 'password'>> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: [
        'professionalProfile',
        'professionalProfile.specialty',
        'membership',
        'file',
      ],
    });

    if (!user) {
      throw new BadRequestException('Usuario no encontrado');
    }

    // Excluir el campo 'password' del objeto de usuario
    const { password, ...userWithoutPassword } = user;
    console.log(userWithoutPassword);
    return userWithoutPassword;
  }

  // Crea un usuario en general y si es profesional, crea su perfil profesional
  async createUser(users: any): Promise<any> {
    //Promise<string | Omit<CreateAccountDto, "password">> {
    //async createUser(users: CreateAccountDto): Promise<string | Omit<CreateAccountDto, "password">> {
    console.log('usersRepository.createUser', users);
    if (users.role === undefined) users = users.user;

    const existeEmail = await this.usersRepository.findOne({
      where: { email: users.email },
    });
    if (existeEmail) return;

    const existeDni = await this.usersRepository.findOne({
      where: { dni: users.dni },
    });

    if (existeDni) return;
    const hashedPassword = await bcrypt.hash(users.password, 10);

    if (!hashedPassword) {
      throw new BadRequestException(
        'Error al tratar de crear el usuario. Intente nuevamente',
      );
    }

    //Cuando se arregle el objeto CreateUserDto, se asignará el tipo de variable 'user' para que sea un objeto de tipo CreateUserDto
    const user: any = {
      name: users.name,
      email: users.email,
      password: users.password,
      phone: users.phone,
      dni: users.dni,
      city: users.city,
      dob: users.dob || new Date(), // Asignar null si no se proporciona una fecha de nacimiento
      createdAt: new Date(), // Asignar la fecha actual
      status: 'Active', // Asignar un valor por defecto
      role: users.role,
    };

    // Guardar el usuario en la base de datos
    const savedUser = await this.usersRepository.save({
      ...user,
      password: hashedPassword,
    });

    // Si el usuario es profesional, guardar su perfil profesional
    if (users.role === 'provider') {
      console.log('Guardando perfil profesional para el usuario:', users.email);
      console.log('especialidades:', users.specialty);
      const userprof = await this.usersRepository.findOne({
        where: { email: users.email },
        select: ['id'], // Seleccionar solo el campo 'id' para evitar cargar todo el objeto
      });
      if (!userprof) {
        throw new BadRequestException(
          'Error al crear el perfil profesional. Usuario no encontrado',
        );
      }

      if (!Array.isArray(users.specialty) || users.specialty?.length === 0)
        throw new BadRequestException(
          'Profesional debe tener al menos una especialidad',
        );

      //-------------
      const specialtyIds: Specialty[] = [];
      for (const specialtyName of users.specialty) {
        const specialty = await this.specialtyRepository.findOne({
          where: { name: specialtyName.toUpperCase() },
        });
        if (!specialty) {
          console.log('Especialidad no encontrada:', specialtyName);
          throw new BadRequestException('Especialidad no encontrada');
        }
        specialtyIds.push(specialty);
      }
      //-------------

      // Cuando se arregle el objeto CreateProfessionalProfileDto, se asignará el tipo de variable 'profesionalProfile' para que sea un objeto de tipo CreateProfessionalProfileDto
      const profesionalProfile: any = {
        biography: users.biography || '', // Asignar un valor por defecto si es undefined
        verified: false, // Asignar un valor por defecto
        experience: users.experience || '', // Asignar un valor por defecto si es undefined
        licenseNumber: users.licenseNumber,
        specialty: specialtyIds, // Asignar las especialidades mapeadas
        user: savedUser, // Asignar el ID del usuario creado
      };

      await this.professionalProfileRepository.save(profesionalProfile);
    }

    if (users.role === 'provider')
      await envioConfirmacion('welcomeProvider', users.email);
    else await envioConfirmacion('welcomeUser', users.email);

    // Excluir el campo 'password' del objeto de usuario
    const { password, ...userWithoutPassword } = users;
    return userWithoutPassword;
  }
}
