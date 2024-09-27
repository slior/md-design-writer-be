import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { Document } from './document.interface';
import { CreateDocumentDto, UpdateDocumentDto } from './document.dto';
import { DocumentStore } from './document.store';

@Injectable()
export class DocumentService
{
  constructor(
    @Inject('DocumentStore') private readonly documentStore: DocumentStore,
  ) {}

  findAll(): Document[] {
    return this.documentStore.listDocuments();
  }

  findOne(id: string): Document | undefined {
    return this.documentStore.findDocumentById(id);
  }

  create(createDocumentDto: CreateDocumentDto): Document {
    const newDocument: Document = {
      id: Date.now().toString(), // Simple ID generation. Consider using UUID in production.
      ...createDocumentDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.documentStore.insertDocument(newDocument);
    return newDocument;
  }

  update(id: string, updateDocumentDto: UpdateDocumentDto): Document | undefined {
 
    let existingDocument = this.documentStore.findDocumentById(id);

    if (!existingDocument) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }
    const updatedDocument: Document = {
      ...existingDocument,
      ...updateDocumentDto,
      updatedAt: new Date(),
    };
    this.documentStore.updateDocument(id, updatedDocument);
    return updatedDocument;
  }

  delete(id: string): void {
    this.documentStore.deleteDocument(id);
  }
}