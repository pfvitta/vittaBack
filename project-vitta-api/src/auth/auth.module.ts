import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthRepository } from './auth.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../common/entities/users.entity';
import { ProfessionalsModule } from '../professionals/professionals.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [ProfessionalsModule, UsersModule, TypeOrmModule.forFeature([User])],
  controllers: [AuthController],
  providers: [AuthService, AuthRepository],
  exports: [AuthRepository],
})
export class AuthModule {}
