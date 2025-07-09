import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../common/entities/users.entity';
import { ProfessionalProfile } from '../common/entities/professionalProfile.entity';
import { Specialty } from '../common/entities/specialty.entity';
import { Files } from '../common/entities/files.entity';
import * as bcrypt from 'bcrypt';
import { Role } from '../common/enums/roles.enum';

@Injectable()
export class ProfessionalsSeederService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(ProfessionalProfile)
    private readonly profRepo: Repository<ProfessionalProfile>,
    @InjectRepository(Specialty)
    private readonly specialtyRepo: Repository<Specialty>,
    @InjectRepository(Files)
    private readonly fileRepo: Repository<Files>,
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

    const imageUrls = [
      'https://res.cloudinary.com/diqwkiyef/image/upload/v1752042836/istockphoto-1372002650-612x612_yinea1.jpg',
      'https://res.cloudinary.com/diqwkiyef/image/upload/v1751842908/y0lkei7qme0qg2wcahgk.jpg',
      'https://res.cloudinary.com/diqwkiyef/image/upload/v1751842867/lyadvy6qooy7ottsutza.webp',
    ];

    const data = [
      {
        name: 'Alexandra Perez',
        email: 'alex@email.com',
        dni: '1234569888',
        phone: '98123658947',
        city: 'Campeche',
        dob: '2002-01-01',
        password: 'Asdfg1234%',
        role: Role.Provider,
        biography:
          'Especialista en nutrición vegana con enfoque integral en el bienestar físico y emocional del paciente.',
        experience: '10 años de experiencia en nutrición clínica',
        licenseNumber: 'CM987G',
        specialties: ['Veganismo', 'Diabetes', 'Obesidad'],
        imgUrl: imageUrls[0],
      },
      {
        name: 'Carolina Gómez',
        email: 'carolina@email.com',
        dni: '8765432199',
        phone: '98123658948',
        city: 'Monterrey',
        dob: '1990-03-21',
        password: 'Asdfg1234%',
        role: Role.Provider,
        biography:
          'Nutrióloga especializada en el tratamiento de trastornos alimenticios.',
        experience: '12 años trabajando con adolescentes',
        licenseNumber: 'CM123X',
        specialties: ['Trastornos alimenticios'],
        imgUrl: imageUrls[1],
      },
      {
        name: 'Lucía Hernández',
        email: 'lucia@email.com',
        dni: '1231231230',
        phone: '98123658949',
        city: 'Guadalajara',
        dob: '1985-07-15',
        password: 'Asdfg1234%',
        role: Role.Provider,
        biography:
          'Especialista en salud hormonal, con énfasis en trastornos tiroideos.',
        experience: '15 años en hospitales privados',
        licenseNumber: 'CM456Y',
        specialties: ['Hipo/hipertiroidismo', 'Obesidad'],
        imgUrl: imageUrls[2],
      },
    ];

    for (const prof of data) {
      const hashedPassword = await bcrypt.hash(prof.password, 10);

      // Crear imagen
      const file = this.fileRepo.create({
        filename: `${prof.name.toLowerCase().replace(/ /g, '_')}.jpg`,
        mimetype: 'image/jpeg',
        imgUrl: prof.imgUrl,
      });
      const savedFile = await this.fileRepo.save(file);

      // Crear usuario con imagen
      const user = this.userRepo.create({
        name: prof.name,
        email: prof.email,
        password: hashedPassword,
        phone: prof.phone,
        dni: prof.dni,
        city: prof.city,
        dob: new Date(prof.dob),
        role: prof.role,
        status: 'Active',
        createAt: new Date(),
        file: savedFile,
      });
      const savedUser = await this.userRepo.save(user);

      // Buscar especialidades
      const specialtyIds: Specialty[] = [];
      for (const specialtyName of prof.specialties) {
        const specialty = specialtyMap.get(specialtyName.toUpperCase());
        if (!specialty) {
          throw new Error(`Especialidad no encontrada: ${specialtyName}`);
        }
        specialtyIds.push(specialty);
      }

      // Crear perfil profesional
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

    console.log('🌱 Seed de profesionales con imagen completado.');
  }
}
