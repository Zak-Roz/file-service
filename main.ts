import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from 'apps/common/src/utils/config/config.service';
import { ValidationPipe } from '@nestjs/common';
import { LoggerService } from 'apps/common/src/utils/logger/logger.service';
import { requestResponseLogger } from 'apps/common/src/utils/logger/logger-middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  const config = new DocumentBuilder()
    .setTitle(configService.get('SWAGGER_TITLE'))
    .setVersion('1.0')
    .addServer(configService.get('SWAGGER_BACKEND_URL'))
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document, {
    swaggerOptions: {
      displayOperationId: true,
    },
  });

  app.enableCors({
    origin: JSON.parse(configService.get('CORS_ORIGINS')),
    exposedHeaders: ['Settings-Version', 'organisationId', 'API-Key'],
  });

  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );

  app.useLogger(new LoggerService());
  app.use(requestResponseLogger);

  await app.init();

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
