import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // This explicitly allows your React frontend to make HTTP requests to this backend
  app.enableCors({
    origin: '*',
  });

  // Keep the 0.0.0.0 binding so Docker maps the port correctly
  await app.listen(3000, '0.0.0.0');
}
bootstrap();
