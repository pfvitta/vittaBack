import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProfessionalsModule } from './professionals/professionals.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { MembershipsModule } from './memberships/memberships.module';
import { AdminModule } from './admin/admin.module';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import typeOrmConfig from './config/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { validationSchema } from './config/validation';

import { Specialty } from './common/entities/specialty.entity';
import { SpecialtySeederService } from './specialty/specialty-seeder.service';

import { PaypalModule } from './paypal/paypal.module';
import { ProfessionalsSeederService } from './professionals/professionals-seeder.service';
import { ProfessionalProfile } from './common/entities/professionalProfile.entity';
import { User } from './common/entities/users.entity';
import { Files } from './common/entities/files.entity';
import { FilesModule } from './files/files.module';
import { StripeModule } from './stripe/stripe.module';

import { Admin } from './common/entities/admin.entity';
import { AdminSeederService } from './helper/admin.seed';
import { NutritionModule } from './nutrition/nutrition.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksModule } from './tasks/tasks.module';
import { WsGateway } from './ws/ws.gateway';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      //envFilePath: '.env.development',
      isGlobal: true,
      load: [typeOrmConfig],
      validationSchema,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => {
        const dbConfig = configService.get<TypeOrmModuleOptions>('typeorm');
        if (!dbConfig) throw new Error('Database configuration is missing');
        return dbConfig;
      },
    }),

    // 👇 Conexión de la entidad Specialty para que el Seeder tenga acceso
    TypeOrmModule.forFeature([
      Specialty,
      ProfessionalProfile,
      User,
      Files,
      Admin,
    ]),

    JwtModule.register({
      global: true,
      signOptions: {
        expiresIn: '1h',
      },
      secret: process.env.JWT_SECRET,
    }),

    /**    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
    }),
 */

    AuthModule,
    UsersModule,
    ProfessionalsModule,
    AppointmentsModule,
    MembershipsModule,
    AdminModule,
    PaypalModule,
    FilesModule,
    StripeModule,
    AdminModule,
    NutritionModule,

    ScheduleModule.forRoot(),
    TasksModule,
    ChatModule,
  ],
  controllers: [],
  providers: [
    SpecialtySeederService,
    ProfessionalsSeederService,
    AdminSeederService,
    WsGateway,
  ],
})
export class AppModule {}
