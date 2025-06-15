import { InjectRepository } from '@nestjs/typeorm';
import { ProfessionalProfile } from '../common/entities/professionalProfile.entity';

import { Repository } from 'typeorm';

import { CreateAccountDto } from 'src/common/dtos/createAccount.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { AuthRepository } from 'src/auth/auth.repository';
import { CreateProfessionalProfileDto } from 'src/common/dtos/createProfessionalProfile.dto';
import { Specialty } from 'src/common/entities/specialty.entity';

@Injectable()
export class ProvidersRepository {
  constructor(
    @InjectRepository(ProfessionalProfile)
    private readonly providersRepository: Repository<ProfessionalProfile>,
    @InjectRepository(Specialty)
    private readonly specialty: Repository<Specialty>,
    private readonly authRepository: AuthRepository,
  ) {}

  async getProviders(): Promise<Omit<ProfessionalProfile, 'password'>[]> {
    const providers = await this.providersRepository.find();
    // const providersWithoutPassword = providers.map(user => {
    //     const { password, ...providersWithoutPassword } = providers; // Excluir el campo 'password'
    //     return providersWithoutPassword;
    // });
    // return providersWithoutPassword;
    return providers;
  }

  async getProvidersById(
    id: string,
  ): Promise<string | Omit<ProfessionalProfile, 'password'>> {
    const providers = await this.providersRepository.findOne({
      where: { id },
      //relations: ['']
    });

    if (providers) return providers;
    //{
    //   const { password, ...providersWithoutPassword } = providers; // Excluir el campo 'password'
    //     return providersWithoutPassword;
    // }
    return 'User not found';
  }

  async createProviders(
    providers: CreateAccountDto,
  ): Promise<ProfessionalProfile> {
    // Traer datos de usuaario creado
    const user = await this.authRepository.existsByEmail(providers.email);

    if (!user) {
      throw new NotFoundException('User not exist');
    }

    if (!providers.specialty) {
      throw new NotFoundException('User not exist');
    }

    const validateSpecialty = await Promise.all(
      providers.specialty.map(async (specialt) => {
        const specialtyFound = await this.specialty.findOne({
          where: { name: specialt.name },
        });

        if (!specialtyFound) {
          throw new NotFoundException(
            `La especialidad '${specialt.name}' no existe`,
          );
        }

        return specialtyFound;
      }),
    );

    const newProfeli: CreateProfessionalProfileDto = {
      biography: providers.biography,
      experience: providers.experience,
      licenseNumber: providers.licenseNumber,
      specialty: validateSpecialty,
    };

    const profile = this.providersRepository.create({
      ...newProfeli,
      user,
    });

    return await this.providersRepository.save(profile);
  }
}
