import { Module } from '@nestjs/common';
import { PaypalController } from './paypal.controller';
import { PaypalService } from './paypal.service';
import { Payment } from '../common/entities/payment.entity';
import { Membership } from '../common/entities/membership.entity';
import { User } from '../common/entities/users.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment, User, Membership])
  ],
  controllers: [PaypalController],
  providers: [PaypalService],
})
export class PaypalModule {}
