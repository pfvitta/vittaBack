import { Module } from '@nestjs/common';
import { ProvidersService } from './professionals.service';
import { ProvidersController } from './professionals.controller';
import { ProvidersRepository } from './professionals.repository';

@Module({
  controllers: [ProvidersController],
  providers: [ProvidersService, ProvidersRepository],
})
export class ProfessionalsModule {}
