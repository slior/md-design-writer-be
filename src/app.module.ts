import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DocumentsModule } from './documents/document.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import documentConfig from './config/document.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [documentConfig],
      isGlobal: true,
    }),
    DocumentsModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost', //TODO: from env
      port: 5432, //TODO: from env
      username: 'postgres', //TODO: from env
      password: 'writerdb', //TODO: from env
      database: 'byte-notes', //TODO: from env
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    })
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
