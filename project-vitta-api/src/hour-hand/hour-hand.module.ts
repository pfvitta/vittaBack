import { Module } from '@nestjs/common';
import { HourHandService } from './hour-hand.service';
import { HourHandController } from './hour-hand.controller';
import { Schedule } from 'src/common/entities/schedule.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HourHandRepository } from './hour-hand.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Schedule])],
  controllers: [HourHandController],
  providers: [HourHandService, HourHandRepository],
})
export class HourHandModule {}
