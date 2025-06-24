
import { Controller, Post } from '@nestjs/common';
import { PaypalService } from './paypal.service';

@Controller('paypal')
export class PaypalController {
  constructor(private readonly paypalService: PaypalService) {}

  @Post('create-order')
  async createOrder() {
    const approvalUrl = await this.paypalService.createOrder();
    return { url: approvalUrl };
  }
}
