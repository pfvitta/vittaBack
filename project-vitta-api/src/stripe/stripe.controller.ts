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
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

config({ path: '.env.development' }); // 👈 Carga tus variables de entorno

@ApiTags('Stripe')
@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  /**
   * Crea un PaymentIntent clásico (sin redireccionamiento)
   * @param email - Correo del usuario
   * @returns PaymentIntent
   */
  @Post('create-order')
  @ApiOperation({
    summary: 'Crear PaymentIntent',
    description: 'Crea un intento de pago clásico (sin redirección).',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'cliente@correo.com' },
      },
    },
  })
  createIntent(@Body('email') email: string) {
    return this.stripeService.createPaymentIntent(49.99, 'usd', email);
  }

  /**
   * Crea una sesión de pago (Checkout Session)
   * @param email - Correo del usuario
   * @returns URL de redirección a Stripe
   */
  @Post('create-checkout-session')
  @ApiOperation({
    summary: 'Crear sesión de checkout',
    description: 'Genera una sesión de pago con Stripe Checkout.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'cliente@correo.com' },
      },
    },
  })
  async createCheckoutSession(@Body('email') email: string) {
    return this.stripeService.createCheckoutSession(email);
  }

  /**
   * Webhook que escucha eventos de Stripe (checkout completado, pagos fallidos, etc.)
   * Valida la firma y reenvía el evento al StripeService
   */
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
      // case 'payment_intent.succeeded': {
      //   const intent = event.data.object as Stripe.PaymentIntent;
      //   console.log('✅ Pago exitoso (intent):', intent.id);
      //   await this.stripeService.handleSuccessfulPayment(intent);
      //   break;
      // }

      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log('✅ Sesión completada:', session.id);
        await this.stripeService.handleCheckoutSessionCompleted(session);
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
