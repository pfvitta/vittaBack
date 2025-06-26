// Este servicio maneja la creación y captura de órdenes de PayPal, así como el 
// registro de pagos en la base de datos.
// También envía correos de confirmación al usuario después de un pago exitoso o cancelado.

import { Injectable } from '@nestjs/common';
import * as paypal from '@paypal/checkout-server-sdk';
import { Payment } from '../common/entities/payment.entity';
import { Repository } from 'typeorm';
import { User } from '../common/entities/users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Membership } from '../common/entities/membership.entity';
import { envioConfirmacion } from '../helper/serviceMail/serviceMail';

@Injectable()
export class PaypalService {
  private environment: paypal.core.SandboxEnvironment;
  private client: paypal.core.PayPalHttpClient;

  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Membership)
    private readonly membershipRepository: Repository<Membership>,
  ) {
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
            value: '49.99',
          },
        },
      ],
      application_context: {
        brand_name: 'Vitta',
        landing_page: 'NO_PREFERENCE',
        user_action: 'PAY_NOW',
        return_url: 'http://localhost:3000/success',
        cancel_url: 'http://localhost:3000/cancel',
      },
    });

    const response = await this.client.execute(request);
    const approvalUrl = response.result.links.find(
      (link) => link.rel === 'approve',
    )?.href;

    if (!approvalUrl) {
      throw new Error('No se pudo obtener la URL de aprobación de PayPal');
    }

    return approvalUrl;
  }

  async captureOrder(orderId: string, userId: string): Promise<any> {
    const request = new paypal.orders.OrdersCaptureRequest(orderId);
    request.requestBody({});

    try {
      const response = await this.client.execute(request);
      const result = response.result;

      if (result.status === 'COMPLETED') {
        const capture = result.purchase_units[0].payments.captures[0];

        const user = await this.userRepository.findOne({
          where: { id: userId },
          relations: ['membership'],
        });

        if (!user) {
          throw new Error('Usuario no encontrado');
        }

        const payment = this.paymentRepository.create({
          paypalOrderId: result.id,
          captureId: capture.id,
          stripePaymentIntentId: null, // este campo es para Stripe, no se usa en PayPal
          payerEmail: result.payer.email_address,
          amount: capture.amount.value,
          currency: capture.amount.currency_code,
          status: result.status,
          paymentMethod: 'paypal',
          user: user,
        });

        await this.paymentRepository.save(payment);
        await envioConfirmacion('paymentSuccess', user.email);

        // Activar o crear membresía
        const today = new Date();
        const oneMonthLater = new Date(today);
        oneMonthLater.setMonth(today.getMonth() + 1);

        if (user.membership) {
          user.membership.status = 'Active';
          user.membership.startDate = today;
          user.membership.endDate = oneMonthLater;
          user.membership.price = parseFloat(capture.amount.value);
          user.membership.type = 'mensual';
          await this.membershipRepository.save(user.membership);
        } else {
          const membership = this.membershipRepository.create({
            user: user,
            type: 'mensual',
            status: 'Active',
            startDate: today,
            endDate: oneMonthLater,
            price: parseFloat(capture.amount.value),
          });
          await this.membershipRepository.save(membership);
        }

      } else {
        const payerEmail = result?.payer?.email_address || 'correo_no_disponible@vitta.com';
        await envioConfirmacion('paymentCancel', payerEmail);
      }

      return result;

    } catch (error) {
      console.error('Error al capturar la orden:', error.message);
      throw new Error('No se pudo capturar el pago.');
    }
  }
}
