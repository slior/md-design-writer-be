import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

const FE_URL = process.env.FE_URL || ''
console.log(`FE URL: ${FE_URL}`)

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  if (FE_URL) //if the environment specifies a FE URL, it means we need to enable CORS
  {
    console.log(`Setting CORS for ${FE_URL}`)
    app.enableCors({
      origin: FE_URL, // Allow only your frontend URL
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    });
  }
  else console.log("Not setting CORS")
  await app.listen(3000);
}
bootstrap();