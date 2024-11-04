
import { User } from '../users/user.entity';
import { Document } from './document.interface';

export interface DocumentStore 
{
  listDocuments(user : User): Promise<Document[]>;
  findDocumentById(id: string, user : User): Promise<Document | undefined>;
  findDocumentByIdUnauthorized(id : string): Promise<Document | null>;
  insertDocument(document: Document): Promise<Document>;
  updateDocument(id: string, document: Partial<Document>, user : User): Promise<Document | undefined>;
  deleteDocument(id: string): Promise<void>;
}

