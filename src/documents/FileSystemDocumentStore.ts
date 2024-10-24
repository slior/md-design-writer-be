

import * as fs from 'fs';
import * as path from 'path';

import { Logger } from '@nestjs/common';

import { DocumentStore } from './document.store';
import { Document } from './document.interface';


export class FileSystemDocumentStore implements DocumentStore
{
  private readonly logger : Logger = new Logger(FileSystemDocumentStore.name)
  private dataDir: string;

  constructor(dataDir: string)
  {
    this.logger.log(`File system store init to directory: ${dataDir}`)
    this.dataDir = dataDir;
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
  }

  listDocuments(): Promise<Document[]>
  {
    const files = fs.readdirSync(this.dataDir);
    return Promise.resolve(files.map(file => {
      const filePath = this.pathFor(file);
      const content = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(content) as Document;
    }));
  }

  findDocumentById(id: string): Promise<Document | undefined>
  {
    const filePath = this.pathForID(id);
    if (!fs.existsSync(filePath)) {
      return Promise.resolve(undefined);
    }
    const content = fs.readFileSync(filePath, 'utf-8');
    return Promise.resolve(JSON.parse(content) as Document);
  }

  insertDocument(document: Document): Promise<Document>
  {
    document.id = Date.now().toString()
    this.logger.debug(`New document with id: ${document.id}`)
    return this.writeFile(document)
  }

  updateDocument(id: string, document: Partial<Document>): Promise<Document | undefined>
  {
    const existingDocument = this.findDocumentById(id);
    if (!existingDocument) return undefined;

    const updatedDocument : Document = { ...existingDocument, ...document, updatedAt: new Date() } as Document;
    return this.writeFile(updatedDocument)
  }

  deleteDocument(id: string): Promise<void>
  {
    const filePath = this.pathForID(id)
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    return Promise.resolve()
  }

  private writeFile (document : Document) : Promise<Document>
  {
    const filePath = this.pathForID(document.id);
    const content = JSON.stringify(document, null, 2);
    this.logger.debug(`Writing document: ${content}`)
    fs.writeFileSync(filePath, content, 'utf-8');
    return Promise.resolve(document)
  }

  private pathFor(filename : string) : string
  {
    return path.join(this.dataDir, filename);
  }

  private pathForID(id : string) : string
  {
    return this.pathFor(id + '.md')
  }
}