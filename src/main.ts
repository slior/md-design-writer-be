import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe , ConsoleLogger, LogLevel} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';




const FE_URL = process.env.FE_URL || ''
console.log(`FE URL: ${FE_URL}`)

async function bootstrap()
{

  console.log(`ENV = ${process.env.NODE_ENV}`)
  const app = await NestFactory.create(AppModule, {
    logger : createLogger()
  });

  let configService = app.get(ConfigService)
  let dbHost = configService.get<string>('DB_HOST')
  let dbPort = configService.get<number>('DB_PORT')
  let dbUser = configService.get<string>('DB_USERNAME')
  let dbPassword = configService.get<string>('DB_PASSWORD')
  let dbDatabase = configService.get<string>('DB_DATABASE')
  
  console.log(`db:\nhost: ${dbHost}:${dbPort}\nCredentials: ${dbUser}/${dbPassword}\ndatabase: ${dbDatabase}`)

  app.useGlobalPipes(new ValidationPipe());

  setCORSIfNeeded(app);

  await app.listen(3000);
}

bootstrap();

function setCORSIfNeeded(app) {
  if (FE_URL) //if the environment specifies a FE URL, it means we need to enable CORS
  {
    console.log(`Setting CORS for ${FE_URL}`);
    app.enableCors({
      origin: FE_URL, // Allow only your frontend URL
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    });
  }
  else console.log("Not setting CORS");
}

function createLogger()
{
  const logger = new ConsoleLogger();

  // Set log levels based on environment variable
  const logLevels: LogLevel[] = (process.env.LOG_LEVELS || 'error,warn,log').split(',') as LogLevel[];
  logger.setLogLevels(logLevels);
  logger.debug(`Initialized logger, with log levels: ${logLevels}`)
  return logger;
}
