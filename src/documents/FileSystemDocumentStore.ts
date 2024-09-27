

import { DocumentStore } from './document.store';
import { Document } from './document.interface';
import * as fs from 'fs';
import * as path from 'path';

export class FileSystemDocumentStore implements DocumentStore {
  private dataDir: string;

  constructor(dataDir: string) {
    this.dataDir = dataDir;
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
  }

  listDocuments(): Document[] {
    const files = fs.readdirSync(this.dataDir);
    return files.map(file => {
      const filePath = path.join(this.dataDir, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(content) as Document;
    });
  }

  findDocumentById(id: string): Document | undefined {
    const filePath = path.join(this.dataDir, `${id}.md`);
    if (!fs.existsSync(filePath)) {
      return undefined;
    }
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content) as Document;
  }

  insertDocument(document: Document): void {
    const filePath = path.join(this.dataDir, `${document.id}.md`);
    const content = JSON.stringify(document, null, 2);
    fs.writeFileSync(filePath, content, 'utf-8');
  }

  updateDocument(id: string, document: Partial<Document>): Document | undefined {
    const existingDocument = this.findDocumentById(id);
    if (!existingDocument) {
      return undefined;
    }
    const updatedDocument = { ...existingDocument, ...document, updatedAt: new Date() };
    this.insertDocument(updatedDocument);
    return updatedDocument;
  }

  deleteDocument(id: string): void {
    const filePath = path.join(this.dataDir, `${id}.md`);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
}