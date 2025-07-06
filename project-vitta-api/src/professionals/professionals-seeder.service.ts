import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../common/entities/users.entity';
import { ProfessionalProfile } from '../common/entities/professionalProfile.entity';
import { Specialty } from '../common/entities/specialty.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ProfessionalsSeederService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(ProfessionalProfile)
    private readonly profRepo: Repository<ProfessionalProfile>,
    @InjectRepository(Specialty)
    private readonly specialtyRepo: Repository<Specialty>,
  ) {}

  async onApplicationBootstrap() {
    const existing = await this.profRepo.count();
    if (existing > 0) {
      console.log('🔸 Ya existen profesionales. Seed cancelado.');
      return;
    }

    await this.seedProfessionals();
  }

  private async seedProfessionals() {
    const specialties = await this.specialtyRepo.find();
    const specialtyMap = new Map(
      specialties.map((s) => [s.name.toUpperCase(), s]),
    );

    const data = [
      {
        name: 'Alexandra Perez',
        email: 'alex@email.com',
        dni: '1234569888',
        phone: '98123658947',
        city: 'Campeche',
        dob: '2002-01-01',
        password: 'Asdfg1234%',
        role: 'provider',
        biography:
          'Especialista en nutrición vegana con enfoque integral en el bienestar físico y emocional del paciente.  Apasionada por la educación nutricional y la promoción de estilos de vida sostenibles.',
        experience: '10 años de experiencia en nutrición clínica',
        licenseNumber: 'CM987G',
        specialties: ['Veganismo', 'Diabetes', 'Obesidad'],
      },
      {
        name: 'Carlos Gómez',
        email: 'carlos@email.com',
        dni: '8765432199',
        phone: '98123658948',
        city: 'Monterrey',
        dob: '1990-03-21',
        password: 'Asdfg1234%',
        role: 'provider',
        biography:
          'Nutriólogo especializado en el tratamiento de trastornos alimenticios, incluyendo anorexia, bulimia y trastorno por atracón.',
        experience: '12 años trabajando con adolescentes',
        licenseNumber: 'CM123X',
        specialties: ['Trastornos alimenticios'],
      },
      {
        name: 'Lucía Hernández',
        email: 'lucia@email.com',
        dni: '1231231230',
        phone: '98123658949',
        city: 'Guadalajara',
        dob: '1985-07-15',
        password: 'Asdfg1234%',
        role: 'provider',
        biography:
          'Especialista en salud hormonal, con énfasis en el abordaje nutricional de trastornos tiroideos como hipotiroidismo e hipertiroidismo. Intervención metabólica para adultos con sobrepeso y obesidad.',
        experience: '15 años en hospitales privados',
        licenseNumber: 'CM456Y',
        specialties: ['Hipo/hipertiroidismo', 'Obesidad'],
      },
    ];

    for (const prof of data) {
      const hashedPassword = await bcrypt.hash(prof.password, 10);
      let user = {
        name: prof.name,
        email: prof.email,
        password: hashedPassword,
        phone: prof.phone,
        dni: prof.dni,
        city: prof.city,
        dob: new Date(prof.dob),
        role: prof.role,
        status: 'Active',
        createdAt: new Date(),
      };
      const savedUser = await this.userRepo.save(user);

      const specialtyIds: Specialty[] = [];
      for (const specialtyName of prof.specialties) {
        const specialty = await this.specialtyRepo.findOne({
          where: { name: specialtyName.toUpperCase() },
        });
        if (!specialty) {
          throw new Error('Especialidad no encontrada');
        }
        specialtyIds.push(specialty);
      }

      const profile = this.profRepo.create({
        biography: prof.biography,
        experience: prof.experience,
        licenseNumber: prof.licenseNumber,
        verified: false,
        specialty: specialtyIds,
        user: savedUser,
      });

      await this.profRepo.save(profile);
    }

    console.log('🌱 Seed de profesionales completado.');
  }
}
