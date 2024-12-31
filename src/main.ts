// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// Import Swagger modules
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('NestJS API')
    .setDescription('API documentation for the NestJS project with JWT and MySQL')
    .setVersion('1.0')
    .addBearerAuth() // Enable Bearer authentication for JWT
    .addTag('Authentication')
    .addTag('Users')
    .addTag('Posts')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // Swagger UI will be available at /api

  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
