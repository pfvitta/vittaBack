// src/database/seeds/specialty.seed.ts
import { DataSource } from 'typeorm';
import { Specialty } from '../../common/entities/specialty.entity';

export const seedSpecialties = async (dataSource: DataSource) => {
  const specialtyRepo = dataSource.getRepository(Specialty);

  const existing = await specialtyRepo.find();
  if (existing.length > 0) {
    console.log('🔸 Las especialidades ya existen. Seed cancelado.');
    return;
  }

  const specialties = specialtyRepo.create([
    { name: 'VEGANISMO' },
    { name: 'DIABETES' },
    { name: 'OBESIDAD' },
    { name: 'CELIAQUÍA' },
    { name: 'HIPO/HIPERTIROIDISMO' },
    { name: 'TRASTORNOS ALIMENTICIOS' },
  ]);

  await specialtyRepo.save(specialties);
  console.log('✅ Especialidades insertadas correctamente.');
};
