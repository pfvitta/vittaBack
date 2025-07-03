import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../common/entities/users.entity';
import { ProfessionalProfile } from '../common/entities/professionalProfile.entity';
import { Specialty } from '../common/entities/specialty.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, ProfessionalProfile, Specialty])],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService],
})
export class UsersModule {}
