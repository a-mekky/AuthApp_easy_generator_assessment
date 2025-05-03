import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
// import { LoggerService } from './logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Custom logger
  // const logger = app.get(LoggerService);
  // app.useLogger(logger);
  // app.use(new LoggerMiddleware().use);

  // Set global prefix for all routes
  app.setGlobalPrefix('api');
  // Enable CORS for all routes (forntend)
  app.enableCors();

  // Apply validation pipe globally
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Set up Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Authentication API')
    .setDescription('API for user authentication')
    .setVersion('1.0')
    .addTag('auth')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Server will run on port 3000 or the port specified in the environment variable
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
