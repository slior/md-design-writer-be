
import { registerAs } from '@nestjs/config';
import { DocumentStoreType } from '../documents/document.store.types'

export default registerAs('document', () => ({
  storeType: process.env.DOCUMENT_STORE_TYPE || DocumentStoreType.FILE_SYSTEM,
  postgres: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'writerdb',
    database: process.env.DB_DATABASE || 'byte-notes',
  },
  filesystem: {
    basePath: process.env.DOCUMENT_FS_PATH || './data',
  },
}));