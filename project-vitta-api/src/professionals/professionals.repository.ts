import { InjectRepository } from '@nestjs/typeorm';
import { ProfessionalProfile } from '../common/entities/professionalProfile.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProvidersRepository {
  constructor(
    @InjectRepository(ProfessionalProfile)
    private readonly providersRepository: Repository<ProfessionalProfile>,
  ) {}
}
