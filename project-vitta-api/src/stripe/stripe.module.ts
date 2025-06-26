// src/stripe/stripe.module.ts
import { Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { StripeController } from './stripe.controller';
import { Payment } from '../common/entities/payment.entity';
import { User } from '../common/entities/users.entity';
import { Membership } from '../common/entities/membership.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [
        TypeOrmModule.forFeature([Payment, User, Membership])
      ],
  providers: [StripeService],
  controllers: [StripeController],
})
export class StripeModule {}
