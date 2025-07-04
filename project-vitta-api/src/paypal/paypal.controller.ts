import { Body, Controller, Post } from '@nestjs/common';
import { PaypalService } from './paypal.service';

@Controller('paypal')
export class PaypalController {
  constructor(private readonly paypalService: PaypalService) {}

  @Post('create-order')
  async createOrder() {
    const approvalUrl = await this.paypalService.createOrder();
    return { url: approvalUrl };
  }

  @Post('capture-order')
  async captureOrder(@Body() body: { token: string; userId: string }) {
    const result = await this.paypalService.captureOrder(
      body.token,
      body.userId,
    );
    return result;
  }
}
