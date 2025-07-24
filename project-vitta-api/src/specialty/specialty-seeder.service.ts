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
      { name: 'Veganismo' },
      { name: 'Diabetes' },
      { name: 'Obesidad' },
      { name: 'Celiaquía' },
      { name: 'Hipo/Hipertiroidismo' },
      { name: 'Trastornos Alimenticios' },
    ]);

    await this.specialtyRepo.save(specialties);
    console.log('🌱 Seed de especialidades completado.');
  }
}
