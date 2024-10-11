import { Test, TestingModule } from '@nestjs/testing';
import { DocumentService } from './document.service';
import { NotFoundException } from '@nestjs/common';
import { CreateDocumentDto, UpdateDocumentDto } from './document.dto';
import { Document } from './document.interface';
import { DocumentStore } from './document.store';

class InMemoryDocumentStore implements DocumentStore 
{
    private documents: Document[] = [];

    listDocuments(): Promise<Document[]>
    {
        return Promise.resolve(this.documents);
    }

    findDocumentById(id: string): Promise<Document | undefined>
    {
      return Promise.resolve(this.documents.find(doc => doc.id === id));
    }
  
    insertDocument(document: Document): Promise<Document>
    {
      this.documents.push(document);
      return Promise.resolve(document)
    }
  
    updateDocument(id: string, document: Partial<Document>): Promise<Document | undefined>
    {
      const index = this.documents.findIndex(doc => doc.id === id);
      if (index === -1) {
        throw new NotFoundException(`document ${id} not found`)
      }
      this.documents[index] = { ...this.documents[index], ...document };
      return Promise.resolve(this.documents[index]);
    }
  
    deleteDocument(id: string): Promise<void>
    {
        if (!this.documents.some(doc => doc.id === id)) {
            throw new NotFoundException(`Document with ID ${id} not found`);
        }
        this.documents = this.documents.filter(doc => doc.id !== id);
        return Promise.resolve()
    }
  }


describe('DocumentService', () => 
{
    let service: DocumentService;
    let store: DocumentStore;

    beforeEach(async () => {
        store = new InMemoryDocumentStore();
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                DocumentService,
                { provide: 'DocumentStore', useValue: store },
            ],
        }).compile();

        service = module.get<DocumentService>(DocumentService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('findAll', () => 
    {
        it('should return an array of documents', async () => {
            let docs = await service.findAll()
            expect(docs).toEqual([]);
        });
    });

    describe('findOne', () =>
    {
        it('should return a document if found', async () => {
            const document: Document = { id: '1', title: 'Test', content: 'Test content', createdAt: new Date(), updatedAt: new Date() , author : 'mickey'};
            store.insertDocument(document)
            let doc = await service.findOne('1')
            expect(doc).toEqual(document);
        });

        it('should return undefined if not found', async () => {
            let ret = await service.findOne('2')
            expect(ret).toBeUndefined();
        });
    });

    describe('create', () => 
    {
        it('should create and return a new document', async () => {
            const createDocumentDto: CreateDocumentDto = { title: 'Test', content: 'Test content', author : 'mickey' };
            const document = await service.create(createDocumentDto);
            expect(document).toHaveProperty('id');
            expect(document).toHaveProperty('createdAt');
            expect(document).toHaveProperty('updatedAt');
            expect(document.title).toEqual(createDocumentDto.title);
            expect(document.content).toEqual(createDocumentDto.content);
            expect(document.author).toEqual(createDocumentDto.author);
        });
    });

    describe('update', () => 
    {
        it('should update and return the document', async () => {
            const document: Document = { id: '1', title: 'Test', content: 'Test content', createdAt: new Date(), updatedAt: new Date(), author : 'mickey' };
            store.insertDocument(document);
            const updateDocumentDto: UpdateDocumentDto = { title: 'Updated Test', content: 'Updated content' };
            const updatedDocument = await service.update('1', updateDocumentDto);
            expect(updatedDocument).toHaveProperty('id', '1');
            expect(updatedDocument).toHaveProperty('updatedAt');
            expect(updatedDocument.title).toEqual(updateDocumentDto.title);
            expect(updatedDocument.content).toEqual(updateDocumentDto.content);
        });

        it('should throw NotFoundException if document not found', () => {
            const updateDocumentDto: UpdateDocumentDto = { title: 'Updated Test', content: 'Updated content' };
            expect(() => service.update('2', updateDocumentDto)).toThrow(NotFoundException);
        });
    });

    describe('delete', () => 
    {
        it('should delete the document', async () => {
            const document: Document = { id: '1', title: 'Test', content: 'Test content', createdAt: new Date(), updatedAt: new Date(), author : 'mickey' };
            store.insertDocument(document);
            service.delete('1');
            let doc = await service.findOne('1')
            expect(doc).toBeUndefined();
        });

        it('should throw NotFoundException if document not found', () => {
            expect(() => service.delete('2')).toThrow(NotFoundException);
        });
    });
});