import { Injectable } from '@nestjs/common';
import * as paypal from '@paypal/checkout-server-sdk';

@Injectable()
export class PaypalService {
  private environment: paypal.core.SandboxEnvironment;
  private client: paypal.core.PayPalHttpClient;

  constructor() {
    this.environment = new paypal.core.SandboxEnvironment(
      process.env.PAYPAL_CLIENT_ID,
      process.env.PAYPAL_CLIENT_SECRET,
    );
    this.client = new paypal.core.PayPalHttpClient(this.environment);
  }

  async createOrder(): Promise<string> {
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer('return=representation');
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: '20.00',
          },
        },
      ],
      application_context: {
        return_url: 'https://localhost:3000/success',
        cancel_url: 'https://localhost:3000/cancel',
      },
    });

    const response = await this.client.execute(request);
    const approvalUrl = response.result.links.find(link => link.rel === 'approve')?.href;

    if (!approvalUrl) {
      throw new Error('No se pudo obtener la URL de aprobación de PayPal');
    }

    return approvalUrl;
  }
}
