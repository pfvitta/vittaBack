import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerGlobal } from './common/middleware/logger.middleware';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from './common/guards/auth.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(LoggerGlobal);

  //app.useGlobalGuards(new AuthGuard());

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
    //.addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
