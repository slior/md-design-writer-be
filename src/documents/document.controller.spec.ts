// document.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { DocumentController } from './document.controller';
import { DocumentService } from './document.service';
import { Document } from './document.interface';
import { NotFoundException } from '@nestjs/common';
import { User } from '../users/user.entity';

describe('DocumentController', () => {
  let controller: DocumentController;
  let service: DocumentService;
  let user : User;

  // Mock document for testing
  const mockDocument: Document = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    title: 'Test Document',
    author : new User(),
    content: 'Test Content',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  // Create mock service
  const mockDocumentService = {
    findAll : jest.fn(),
    create: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocumentController],
      providers: [
        {
          provide: DocumentService,
          useValue: mockDocumentService
        }
      ]
    }).compile();

    controller = module.get<DocumentController>(DocumentController);
    service = module.get<DocumentService>(DocumentService);
    user = { id: "1", email: "mickey@example.com", password : "secret", createdAt : new Date(), updatedAt : new Date()  }

    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new document', async () => {
      const createDocumentDto = {
        title: 'Test Document',
        authorID: user.id,
        content: 'Test Content'
      };

      mockDocumentService.create.mockResolvedValue(mockDocument);

      const result = await controller.create(createDocumentDto,user);

      expect(result).toBe(mockDocument);
      expect(service.create).toHaveBeenCalledWith(createDocumentDto,user);
      expect(service.create).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if service fails', async () => {
      const createDocumentDto = {
        title: 'Test Document',
        authorID: user.id,
        content: 'Test Content'
      };

      mockDocumentService.create.mockRejectedValue(new Error('Database error'));

      await expect(controller.create(createDocumentDto,user))
        .rejects
        .toThrow('Database error');
    });
  });

  describe('findById', () => {
    it('should return a document by id', async () => {
      mockDocumentService.findOne.mockResolvedValue(mockDocument);

      const result = await controller.findOne(mockDocument.id,user);

      expect(result).toBe(mockDocument);
      expect(service.findOne).toHaveBeenCalledWith(mockDocument.id,user);
      expect(service.findOne).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException when document not found', async () => {
      mockDocumentService.findOne.mockResolvedValue(null);

      await expect(controller.findOne('nonexistent-id',user))
        .rejects
        .toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a document', async () => {
      const updateDocumentDto = {
        title: 'Updated Title'
      };

      const updatedDocument = { ...mockDocument, ...updateDocumentDto };
      mockDocumentService.update.mockResolvedValue(updatedDocument);

      const result = await controller.update(mockDocument.id, updateDocumentDto,user);

      expect(result).toBe(updatedDocument);
      expect(service.update).toHaveBeenCalledWith(mockDocument.id, updateDocumentDto, user);
      expect(service.update).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException when updating non-existent document', async () => {
      mockDocumentService.update.mockResolvedValue(null);

      await expect(controller.update('nonexistent-id', { title: 'New Title' }, user))
        .rejects
        .toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete a document', async () => {
      mockDocumentService.delete.mockResolvedValue(undefined);

      await controller.delete(mockDocument.id);

      expect(service.delete).toHaveBeenCalledWith(mockDocument.id);
      expect(service.delete).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException when deleting non-existent document', async () => {
      mockDocumentService.delete.mockRejectedValue(new NotFoundException());

      await expect(controller.delete('nonexistent-id'))
        .rejects
        .toThrow(NotFoundException);
    });
  });
});