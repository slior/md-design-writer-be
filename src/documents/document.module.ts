import { Module } from '@nestjs/common';
import { DocumentController } from './document.controller';
import { DocumentService } from './document.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import documentConfig from 'src/config/document.config';
import { DocumentStoreType } from './document.store.types';
import { PostgreSQLDocumentStore } from './db/PostgresDocumentStore';
import { FileSystemDocumentStore } from './FileSystemDocumentStore';
import { DocumentEntity } from './db/document.entity';
import { Repository } from 'typeorm';



@Module({
  imports : [
    ConfigModule.forFeature(documentConfig),
    TypeOrmModule.forFeature([DocumentEntity]),
  ],
  controllers: [DocumentController],
  providers:
   [
        DocumentService, 
        {
          provide: 'DocumentStore',
          useFactory: (configService: ConfigService, docRepository : Repository<DocumentEntity>) =>
          {
            const storeType = configService.get<string>('document.storeType');
            
            switch (storeType)
            {
              case DocumentStoreType.POSTGRES:
                return new PostgreSQLDocumentStore(docRepository);
              case DocumentStoreType.FILE_SYSTEM:
                return new FileSystemDocumentStore('./data');
              default:
                throw new Error(`Unknown document store type: ${storeType}`);
            }
          },
          inject: [ConfigService, getRepositoryToken(DocumentEntity)],
        }
  ],
  exports : ['DocumentStore']
})
export class DocumentsModule {}