import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DocumentsModule } from './documents/document.module';

@Module({
  imports: [DocumentsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
