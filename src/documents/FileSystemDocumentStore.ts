

import { DocumentStore } from './document.store';
import { Document } from './document.interface';
import * as fs from 'fs';
import * as path from 'path';

export class FileSystemDocumentStore implements DocumentStore
{
  private dataDir: string;

  constructor(dataDir: string) {
    this.dataDir = dataDir;
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
  }

  listDocuments(): Promise<Document[]>
  {
    const files = fs.readdirSync(this.dataDir);
    return Promise.resolve(files.map(file => {
      const filePath = path.join(this.dataDir, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(content) as Document;
    }));
  }

  findDocumentById(id: string): Promise<Document | undefined>
  {
    const filePath = path.join(this.dataDir, `${id}.md`);
    if (!fs.existsSync(filePath)) {
      return Promise.resolve(undefined);
    }
    const content = fs.readFileSync(filePath, 'utf-8');
    return Promise.resolve(JSON.parse(content) as Document);
  }

  insertDocument(document: Document): Promise<Document>
  {
    document.id = Date.now().toString()
    const filePath = path.join(this.dataDir, `${document.id}.md`);
    const content = JSON.stringify(document, null, 2);
    fs.writeFileSync(filePath, content, 'utf-8');
    return Promise.resolve(document)
  }

  updateDocument(id: string, document: Partial<Document>): Promise<Document | undefined>
  {
    const existingDocument = this.findDocumentById(id);
    if (!existingDocument) {
      return undefined;
    }
    const updatedDocument : Document = { ...existingDocument, ...document, updatedAt: new Date() } as Document;
    this.insertDocument(updatedDocument);
    return Promise.resolve(updatedDocument);
  }

  deleteDocument(id: string): Promise<void>
  {
    const filePath = path.join(this.dataDir, `${id}.md`);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    return Promise.resolve()
  }
}