
import { registerAs } from '@nestjs/config';
import { DocumentStoreType } from '../documents/document.store.types'

console.log(`env store type = ${process.env.DOCUMENT_STORE_TYPE}`)
export default registerAs('document', () => ({
  storeType: process.env.DOCUMENT_STORE_TYPE || DocumentStoreType.FILE_SYSTEM,
  postgres: { },
  filesystem: {
    basePath: process.env.DOCUMENT_FS_PATH || './data',
  },
}));