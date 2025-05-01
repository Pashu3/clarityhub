import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { RolesGuard } from './common/guards/roles.guard';
import { Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'; // Import Swagger modules

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  
  app.enableCors({
    origin: frontendUrl,
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  app.setGlobalPrefix('api'); 

  const reflector = app.get(Reflector);
  app.useGlobalGuards(new RolesGuard(reflector)); 

  const config = new DocumentBuilder()
    .setTitle('ClarityHub API')
    .setDescription('API documentation for Auth, Users, Uploads, and AI')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document); 

  const port = process.env.PORT || 5000;
  
  await app.listen(port);
  console.log(`API running on http://localhost:${port}`);
  console.log(`Swagger documentation available at http://localhost:${port}/api/docs`);
  console.log(`Accepting requests from frontend at: ${frontendUrl}`);
}
bootstrap();