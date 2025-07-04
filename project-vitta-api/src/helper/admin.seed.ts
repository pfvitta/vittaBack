import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from '../common/entities/admin.entity';

@Injectable()
export class AdminSeederService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepo: Repository<Admin>,
  ) {}

  async onApplicationBootstrap() {
    const admin = this.adminRepo.create({
      name: 'Administrador',
      email: 'admin@email.com',
      password: 'Asdfg1234%',
    });

    await this.adminRepo.save(admin);
    console.log('🌱 Seed de admin completado.');
  }
}