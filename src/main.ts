import 'module-alias/register';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { APP_PORT } from './constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  
  // Enable cookie parser
  app.use(cookieParser());
  
  // CORS configuration allowing any origin
  app.enableCors({
    // Allow any origin
    origin: '*',
    
    // Enable credentials (cookies, authorization headers)
    credentials: true,
    
    // Allowed methods
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    
    // Allowed headers
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    
    // Headers that can be exposed to the client
    exposedHeaders: ['Content-Disposition'],
    
    // Max age of preflight requests in seconds (1 hour)
    preflightContinue: false,
    optionsSuccessStatus: 204,
    maxAge: 3600
  });
  
  const port = APP_PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
