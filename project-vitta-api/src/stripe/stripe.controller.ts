// src/stripe/stripe.controller.ts
import {
  Controller,
  Post,
  Body,
  HttpCode,
  Req,
  Res,
  Headers,
} from '@nestjs/common';
import { StripeService } from './stripe.service';
import { Request, Response } from 'express';
import Stripe from 'stripe'; // 👈 Importa Stripe como clase por defecto
import { config } from 'dotenv';

config({ path: '.env.development' }); // 👈 Carga tus variables de entorno

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('create-order')
  createIntent(@Body('email') email: string) {
    return this.stripeService.createPaymentIntent(49.99, 'usd', email);
  }

  @Post('webhook')
  @HttpCode(200)
  async handleWebhook(
    @Req() req: Request,
    @Res() res: Response,
    @Headers('stripe-signature') sig: string,
  ) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});
    const secret = process.env.STRIPE_WEBHOOK_SECRET!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, secret);
    } catch (err) {
      console.error('❌ Error verificando la firma del webhook:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    switch (event.type) {
      case 'payment_intent.succeeded': {
        const intent = event.data.object as Stripe.PaymentIntent;
        console.log('✅ Pago exitoso:', intent.id);
        await this.stripeService.handleSuccessfulPayment(intent);
        break;
      }

      case 'payment_intent.payment_failed': {
        const intent = event.data.object as Stripe.PaymentIntent;
        console.error('❌ Pago fallido');
        await this.stripeService.handleFailedPayment(intent);
        break;
      }

  default:
    console.log(`📦 Evento sin manejar: ${event.type}`);
    }
    res.json({ received: true });
  }
}