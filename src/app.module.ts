import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DocumentsModule } from './documents/document.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import documentConfig from './config/document.config';


let dbHost = process.env.DB_HOST
let dbPort = parseInt(process.env.DB_PORT || '5432')
let dbUser = process.env.DB_USERNAME
let dbPassword = process.env.DB_PASSWORD
let dbDatabase = process.env.DB_DATABASE


@Module({
  imports: [
    ConfigModule.forRoot({
      load: [documentConfig],
      isGlobal: true,
    }),
    DocumentsModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: dbHost,
      port: dbPort, 
      username: dbUser, 
      password: dbPassword, 
      database: dbDatabase, 
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    })
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
