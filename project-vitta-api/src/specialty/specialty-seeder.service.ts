// src/database/seeds/specialty-seeder.service.ts
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Specialty } from '../common/entities/specialty.entity';

@Injectable()
export class SpecialtySeederService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(Specialty)
    private readonly specialtyRepo: Repository<Specialty>,
  ) {}

  async onApplicationBootstrap() {
    const existing = await this.specialtyRepo.find();
    if (existing.length > 0) {
      console.log('🔸 Las especialidades ya existen. Seed cancelado.');
      return;
    }

    const specialties = this.specialtyRepo.create([
      { name: 'VEGANISMO' },
      { name: 'DIABETES' },
      { name: 'OBESIDAD' },
      { name: 'CELIAQUÍA' },
      { name: 'HIPO/HIPERTIROIDISMO' },
      { name: 'TRASTORNOS ALIMENTICIOS' },
    ]);

    await this.specialtyRepo.save(specialties);
    console.log('✅ Especialidades insertadas automáticamente al iniciar.');
  }
}
