import { Module } from '@nestjs/common';
import { ProvidersService } from './professionals.service';
import { ProvidersController } from './professionals.controller';
import { ProvidersRepository } from './professionals.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfessionalProfile } from '../common/entities/professionalProfile.entity';
import { Specialty } from '../common/entities/specialty.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([ProfessionalProfile, Specialty]),
  ],
  controllers: [ProvidersController],
  providers: [ProvidersService, ProvidersRepository],
  exports: [ProvidersService],
})
export class ProfessionalsModule {}
