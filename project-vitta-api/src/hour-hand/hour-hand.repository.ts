import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Schedule } from 'src/common/entities/schedule.entity';
import { Repository } from 'typeorm';

@Injectable()
export class HourHandRepository {
  constructor(
    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>,
  ) {}
  async validatehHurHand() {
    return await this.scheduleRepository.find();
  }

  async hourHand(item: Partial<Schedule>) {
    return await this.scheduleRepository.save({ hourHand: item.hourHand });
  }
}
