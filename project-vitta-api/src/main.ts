import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerGlobal } from './common/middleware/logger.middleware';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
// import { auth } from 'express-openid-connect';
// import { config as auth0Config } from './config/auth0.config';
// import { AuthGuard } from './common/guards/auth.guard';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(LoggerGlobal);

  // ✅ CORS: permite prod, local y previews de Vercel
  const ALLOWLIST = [
    'http://localhost:3000',
    'https://pf-vitta.vercel.app',
  ];

  app.enableCors({
    origin: (origin, cb) => {
      // Permite requests sin Origin (SSR/Postman) y los orígenes válidos
      const ok =
        !origin ||
        ALLOWLIST.includes(origin) ||
        /https:\/\/.*-pf-vitta\.vercel\.app$/.test(origin); // previews de Vercel
      cb(ok ? null : new Error('CORS blocked'), ok);
    },
    credentials: true, // déjalo en true si usas cookies/sesiones; no afecta Bearer
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // app.use(auth(auth0Config));

  // ✅ Stripe webhook: usa body RAW en esa ruta
  app.use('/stripe/webhook', express.raw({ type: '*/*' }));

  // ✅ Si usas cookies detrás de Render/Proxy
  // (evita problemas con SameSite=None; Secure y X-Forwarded-Proto)
  (app.getHttpAdapter().getInstance() as any).set('trust proxy', 1);

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