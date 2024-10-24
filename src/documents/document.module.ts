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


const DOC_CONFIG_PREFIX = 'document'

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
            const storeType = configService.get<string>(`${DOC_CONFIG_PREFIX}.storeType`);
            
            switch (storeType)
            {
              case DocumentStoreType.POSTGRES:
                return new PostgreSQLDocumentStore(docRepository);
              case DocumentStoreType.FILE_SYSTEM:
                let dataPath = configService.get<string>(`${DOC_CONFIG_PREFIX}.${DocumentStoreType.FILE_SYSTEM}.basePath`)
                return new FileSystemDocumentStore(dataPath);
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