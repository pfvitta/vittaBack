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
      throw new InternalServerErrorException('Stripe secret key not configured');
    }

    this.stripe = new Stripe(stripeKey, {});
  }

  async createPaymentIntent(amountInDollars = 49.99, currency: string = 'usd') {
    const amountInCents = Math.round(Number(amountInDollars) * 100);

    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: amountInCents,
      currency,
      automatic_payment_methods: { enabled: true },
    });

    return {
      clientSecret: paymentIntent.client_secret,
    };
  }

  async handleSuccessfulPayment(intent: Stripe.PaymentIntent): Promise<void> {
    const paymentIntent = await this.stripe.paymentIntents.retrieve(intent.id, {
        expand: ['charges'],
    });

    const email = paymentIntent.receipt_email;

    if (!email) {
        throw new Error('No se pudo determinar el correo electrónico del usuario');
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
    await envioConfirmacion('paymentSuccess', user.email);

    const today = new Date();
    const oneMonthLater = new Date(today);
    oneMonthLater.setMonth(today.getMonth() + 1);

    if (user.membership) {
        user.membership.status = 'Active';
        user.membership.startDate = today;
        user.membership.endDate = oneMonthLater;
        user.membership.price = parseFloat((paymentIntent.amount / 100).toFixed(2));
        user.membership.type = 'mensual';
        await this.membershipRepository.save(user.membership);
    } else {
        const membership = this.membershipRepository.create({
        user,
        type: 'mensual',
        status: 'Active',
        startDate: today,
        endDate: oneMonthLater,
        price: parseFloat((paymentIntent.amount / 100).toFixed(2)),
        });
        await this.membershipRepository.save(membership);
    }
    }

    async handleFailedPayment(intent: Stripe.PaymentIntent): Promise<void> {
        const paymentIntent = await this.stripe.paymentIntents.retrieve(intent.id, {
            expand: ['charges'],
        });

        const email = paymentIntent.receipt_email;

        const payerEmail = email || 'correo_no_disponible@vitta.com';

        await envioConfirmacion('paymentCancel', payerEmail);
    }

}






// import { Injectable, InternalServerErrorException } from '@nestjs/common';
// import Stripe from 'stripe';
// import { config as dotenvConfig } from 'dotenv';

// dotenvConfig({ path: '.env.development' });

// @Injectable()
// export class StripeService {
//   private stripe: Stripe;

//   constructor() {
//     const stripeKey = process.env.STRIPE_SECRET_KEY;
//     if (!stripeKey) {
//       throw new InternalServerErrorException('Stripe secret key not configured');
//     }

//     this.stripe = new Stripe(stripeKey, {});
//   }

//   async createPaymentIntent(amountInDollars = 49.99, currency: string = 'usd') {
//     const amountInCents = Math.round(amountInDollars * 100);

//     try {
//       const paymentIntent = await this.stripe.paymentIntents.create({
//         amount: amountInCents,
//         currency,
//         automatic_payment_methods: { enabled: true }
//       });

//       return {
//         clientSecret: paymentIntent.client_secret,
//       };
//     } catch (error) {
//       console.error('Stripe error:', error);
//       throw new InternalServerErrorException('Error creating payment intent');
//     }
//   }
// }
