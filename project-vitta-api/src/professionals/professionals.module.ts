import { Module } from '@nestjs/common';
import { ProvidersService } from './professionals.service';
import { ProvidersController } from './professionals.controller';
import { ProvidersRepository } from './professionals.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfessionalProfile } from '../common/entities/professionalProfile.entity'; 

@Module({
  imports : [TypeOrmModule.forFeature([ProfessionalProfile])],
  controllers: [ProvidersController],
  providers: [ProvidersService, ProvidersRepository],
})
export class ProfessionalsModule {}
