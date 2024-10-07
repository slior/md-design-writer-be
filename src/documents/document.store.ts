
import { Document } from './document.interface';

export interface DocumentStore 
{
  listDocuments(): Promise<Document[]>;
  findDocumentById(id: string): Promise<Document | undefined>;
  insertDocument(document: Document): Promise<Document>;
  updateDocument(id: string, document: Partial<Document>): Promise<Document | undefined>;
  deleteDocument(id: string): Promise<void>;
}

