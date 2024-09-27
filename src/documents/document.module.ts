import { Module } from '@nestjs/common';
import { DocumentController } from './document.controller';
import { DocumentService } from './document.service';
import { FileSystemDocumentStore } from './FileSystemDocumentStore';

@Module({
  controllers: [DocumentController],
  providers:
   [
        DocumentService, 
        {
            provide: 'DocumentStore',
            useFactory: () => {
            return new FileSystemDocumentStore('./data');
            },
        },
  ],
})
export class DocumentsModule {}