import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerGlobal } from './common/middleware/logger.middleware';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
//import { auth } from 'express-openid-connect';
//import { config as auth0Config } from './config/auth0.config';
//import { AuthGuard } from './common/guards/auth.guard';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(LoggerGlobal);

  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });

<<<<<<< HEAD
  app.use(auth(auth0Config));
=======
  //app.use(auth(auth0Config));
>>>>>>> 024bc6cbb06591ae5be0325f0f51d89eb21b998f
  app.use('/stripe/webhook', express.raw({ type: '*/*' }));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      exceptionFactory: (errors) => {
        const cleanErrors = errors.map((error) => {
          return {
            property: error.property,
            constraints: error.constraints,
          };
        });

        return new BadRequestException({
          alert: 'Se han detectado los siguientes errores',
          errors: cleanErrors,
        });
      },
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Vitta API')
    .setDescription('Documentación de la API para el sistema Vitta')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
