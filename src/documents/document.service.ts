import { Injectable, NotFoundException, Inject, Logger } from '@nestjs/common';
import { Document } from './document.interface';
import { CreateDocumentDto, UpdateDocumentDto } from './document.dto';
import { DocumentStore } from './document.store';
import { User } from '../users/user.entity';

@Injectable()
export class DocumentService
{
  private readonly logger = new Logger(DocumentService.name);
  constructor(
    @Inject('DocumentStore') private readonly documentStore: DocumentStore,
  ) {}

  findAll(user : User): Promise<Document[]>
  {
    this.logger.debug('Service find all')
    return this.documentStore.listDocuments(user)

  }

  findOne(id: string, user : User): Promise<Document | undefined>
  {
    return this.documentStore.findDocumentById(id,user);
  }

  async create(createDocumentDto: CreateDocumentDto, author: User): Promise<Document>
  {
    try 
    {

      const newDocument: Document = 
      {
        id: Date.now().toString(), // Simple ID generation. each store handles it differently. consider making it optional in the class
        ...createDocumentDto,
        createdAt: new Date(),
        updatedAt: new Date(),
        author : author
      };
      let ret = await this.documentStore.insertDocument(newDocument);
      this.logger.debug(`Success in persisting ${JSON.stringify(ret)}`)
      return ret;
    }
    catch (exn)
    {
      this.logger.error(exn.toString())
      throw exn
    }
  }

  update(id: string, updateDocumentDto: UpdateDocumentDto, user : User): Promise<Document | undefined>
  {
    const documentUpdate: Partial<Document> = {
      ...updateDocumentDto,
      updatedAt: new Date(),
      author : user
    };
    return this.documentStore.updateDocument(id, documentUpdate, user);
  }

  delete(id: string): Promise<void> {
    return this.documentStore.deleteDocument(id);
  }
}