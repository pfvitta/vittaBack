import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProfessionalsModule } from './professionals/professionals.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { MembershipsModule } from './memberships/memberships.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ProfessionalsModule,
    AppointmentsModule,
    MembershipsModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
