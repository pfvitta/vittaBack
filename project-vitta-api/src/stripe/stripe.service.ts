import { Injectable, InternalServerErrorException } from '@nestjs/common';
import Stripe from 'stripe';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from '../common/entities/payment.entity';
import { User } from '../common/entities/users.entity';
import { Membership } from '../common/entities/membership.entity';
import { envioConfirmacion } from '../helper/serviceMail/serviceMail';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Membership)
    private readonly membershipRepository: Repository<Membership>,
  ) {
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) {
      throw new InternalServerErrorException(
        'Stripe secret key not configured',
      );
    }

    this.stripe = new Stripe(stripeKey, {});
  }

  async createPaymentIntent(
    amountInDollars = 49.99,
    currency: string = 'usd',
    email?: string,
  ) {
    const amountInCents = Math.round(Number(amountInDollars) * 100);

    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: amountInCents,
      currency,
      automatic_payment_methods: { enabled: true },
      receipt_email: email,
    });

    return {
      clientSecret: paymentIntent.client_secret,
    };
  }

  async handleSuccessfulPayment(intent: Stripe.PaymentIntent): Promise<void> {
    const paymentIntent = (await this.stripe.paymentIntents.retrieve(
      intent.id,
      {
        expand: ['charges'],
      },
    )) as unknown as Stripe.PaymentIntent & {
      charges: { data: Stripe.Charge[] };
    };

    const charge = paymentIntent.charges.data[0];
    const email = paymentIntent.receipt_email || charge?.billing_details?.email;

    if (!email) {
      throw new Error(
        'No se pudo determinar el correo electrónico del usuario',
      );
    }

    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['membership'],
    });

    if (!user) {
      throw new Error('Usuario no encontrado por email');
    }

    const payment = this.paymentRepository.create({
      payerEmail: email,
      stripePaymentIntentId: paymentIntent.id,
      amount: (paymentIntent.amount / 100).toFixed(2),
      currency: paymentIntent.currency,
      status: paymentIntent.status,
      paymentMethod: 'stripe',
      user,
    });

    await this.paymentRepository.save(payment);

    try {
      await envioConfirmacion('paymentSuccess', user.email);
    } catch (err) {
      console.error('Error enviando correo:', err.message);
    }

    const today = new Date();
    const oneMonthLater = new Date(today);
    oneMonthLater.setMonth(today.getMonth() + 1);

    const membership =
      user.membership ?? this.membershipRepository.create({ user });
    membership.status = 'Active';
    membership.startDate = today;
    membership.endDate = oneMonthLater;
    membership.price = parseFloat((paymentIntent.amount / 100).toFixed(2));
    membership.type = 'mensual';
    await this.membershipRepository.save(membership);
  }

  async handleFailedPayment(intent: Stripe.PaymentIntent): Promise<void> {
    // obtener info del intento fallido
    const paymentIntent = (await this.stripe.paymentIntents.retrieve(
      intent.id,
      {
        expand: ['charges'],
      },
    )) as unknown as Stripe.PaymentIntent & {
      charges: { data: Stripe.Charge[] };
    };

    const charge = paymentIntent.charges.data[0];
    const email = paymentIntent.receipt_email || charge?.billing_details?.email;

    if (!email) {
      console.warn(
        'No se pudo determinar el correo electrónico del usuario en pago fallido',
      );
      return;
    }

    // Opcional: buscar usuario y actualizar estado, enviar email, etc.
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      console.warn('Usuario no encontrado para pago fallido con email:', email);
      return;
    }

    // Guardar registro de pago fallido
    const payment = this.paymentRepository.create({
      payerEmail: email,
      stripePaymentIntentId: paymentIntent.id,
      amount: (paymentIntent.amount / 100).toFixed(2),
      currency: paymentIntent.currency,
      status: paymentIntent.status,
      paymentMethod: 'stripe',
      user,
    });
    await this.paymentRepository.save(payment);

    // Puedes enviar un correo notificando el fallo si quieres
    try {
      await envioConfirmacion('paymentFailed', user.email);
    } catch (err) {
      console.error('Error enviando correo de pago fallido:', err.message);
    }
  }

  async handlePaymentCancellation(payerEmail: string): Promise<void> {
    /////// crea por que esta linea esta generaando error  await envioConfirmacion('paymentCancel', payerEmail);
    if (!payerEmail) {
      throw new Error('Email del pagador es requerido');
    }

    try {
      await envioConfirmacion('paymentCancel', payerEmail);
    } catch (error) {
      console.error('Error al notificar cancelación:', error);
      throw new InternalServerErrorException('Error al procesar cancelación');
    }
  }
}
