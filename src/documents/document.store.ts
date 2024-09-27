
import { Document } from './document.interface';

export interface DocumentStore 
{
  listDocuments(): Document[];
  findDocumentById(id: string): Document | undefined;
  insertDocument(document: Document): void;
  updateDocument(id: string, document: Partial<Document>): Document | undefined;
  deleteDocument(id: string): void;
}

