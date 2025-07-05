import { Controller, Post } from '@nestjs/common';
import { HourHandService } from './hour-hand.service';

@Controller('hour-hand')
export class HourHandController {
  constructor(private readonly hourHandService: HourHandService) {}

  @Post()
  async hourHand() {
    return await this.hourHandService.hourHand();
  }
}
