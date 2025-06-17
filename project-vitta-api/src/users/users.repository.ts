import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateAccountDto } from "../common/dtos/createAccount.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../common/entities/users.entity";
import * as bcrypt from 'bcrypt';
import { ProfessionalProfile } from "src/common/entities/professionalProfile.entity";
import { CreateUserDto } from '../common/dtos/createUser.dto';
import { CreateProfessionalProfileDto } from "../common/dtos/createProfessionalProfile.dto";
import { access } from "fs";

@Injectable()
export class UsersRepository {
    
    constructor(
        @InjectRepository(User) private readonly usersRepository: Repository<User>,
        @InjectRepository(ProfessionalProfile) private readonly professionalProfileRepository: Repository<ProfessionalProfile>
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
            relations: ['professionalProfile', 'membership'] // Asegurarse de incluir las relaciones con el perfil profesional y la membresía si es necesario
        });

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

<<<<<<< HEAD
    // Excluir el campo 'password' del objeto de usuario
    const { password, ...userWithoutPassword } = users;
    return userWithoutPassword;
  }
}
=======
    // Crea un usuario en general y si es profesional, crea su perfil profesional
    async createUser(users: CreateAccountDto): Promise<string | Omit<CreateAccountDto, "password">> {
        const existeEmail = await this.usersRepository.findOne({
            where: { email: users.email }
        });
        if (existeEmail) throw new BadRequestException('Este email ya está en uso');

        const existeDni = await this.usersRepository.findOne({
            where: { dni: users.dni }
        });

        if (existeDni) throw new BadRequestException('Este dni ya está en uso');
        
        const hashedPassword = await bcrypt.hash(users.password, 10);
        if (!hashedPassword) {
            throw new BadRequestException('Error al tratar de crear el usuario. Intente nuevamente');
        }

        //Cuando se arregle el objeto CreateUserDto, se asignará el tipo de variable 'user' para que sea un objeto de tipo CreateUserDto
        const user:any = {
            name: users.name,
            email: users.email,
            password: users.password,
            phone: users.phone,
            dni: users.dni,
            city: users.city,
            dob: users.dob,
            createdAt: new Date(), // Asignar la fecha actual
            status: 'activo', // Asignar un valor por defecto
            role: users.role
        }

        // Guardar el usuario en la base de datos
        const savedUser = await this.usersRepository.save({ ...user, password: hashedPassword});

        // Si el usuario es profesional, guardar su perfil profesional
        if (users.role === 'provider') {
            const userprof = await this.usersRepository.findOne({
                where: {email: users.email},
                select: ['id'] // Seleccionar solo el campo 'id' para evitar cargar todo el objeto
            });
            if (!userprof) {
                throw new BadRequestException('Error al crear el perfil profesional. Usuario no encontrado');
            }

            // Cuando se arregle el objeto CreateProfessionalProfileDto, se asignará el tipo de variable 'profesionalProfile' para que sea un objeto de tipo CreateProfessionalProfileDto
            const profesionalProfile: any = {
                biography: users.biography || '', // Asignar un valor por defecto si es undefined
                verified: false, // Asignar un valor por defecto
                experience: users.experience || '', // Asignar un valor por defecto si es undefined
                licenseNumber: users.licenseNumber,
                specialtyId: users.specialty,
                user : savedUser// Asignar el ID del usuario creado
            }

            await this.professionalProfileRepository.save(profesionalProfile);
        }

        // Excluir el campo 'password' del objeto de usuario
        const { password, ...userWithoutPassword } = users;
        return userWithoutPassword;
    }

}
>>>>>>> 1c2e9b9ce5c58a295575cf723df3f974bab8b1e4
