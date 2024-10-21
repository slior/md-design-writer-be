import { Module } from '@nestjs/common';
import { DocumentsModule } from './documents/document.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import documentConfig from './config/document.config';
import databaseConfig from './config/database.config';


@Module({
  imports: [
    ConfigModule.forRoot({
      load: [documentConfig, databaseConfig],
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),
    DocumentsModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        ...configService.get('database'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  
}
