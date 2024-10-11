// document.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { DocumentController } from './document.controller';
import { DocumentService } from './document.service';
import { Document } from './document.interface';
import { NotFoundException } from '@nestjs/common';

describe('DocumentController', () => {
  let controller: DocumentController;
  let service: DocumentService;

  // Mock document for testing
  const mockDocument: Document = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    title: 'Test Document',
    author: 'Test Author',
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

    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new document', async () => {
      const createDocumentDto = {
        title: 'Test Document',
        author: 'Test Author',
        content: 'Test Content'
      };

      mockDocumentService.create.mockResolvedValue(mockDocument);

      const result = await controller.create(createDocumentDto);

      expect(result).toBe(mockDocument);
      expect(service.create).toHaveBeenCalledWith(createDocumentDto);
      expect(service.create).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if service fails', async () => {
      const createDocumentDto = {
        title: 'Test Document',
        author: 'Test Author',
        content: 'Test Content'
      };

      mockDocumentService.create.mockRejectedValue(new Error('Database error'));

      await expect(controller.create(createDocumentDto))
        .rejects
        .toThrow('Database error');
    });
  });

  describe('findById', () => {
    it('should return a document by id', async () => {
      mockDocumentService.findOne.mockResolvedValue(mockDocument);

      const result = await controller.findOne(mockDocument.id);

      expect(result).toBe(mockDocument);
      expect(service.findOne).toHaveBeenCalledWith(mockDocument.id);
      expect(service.findOne).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException when document not found', async () => {
      mockDocumentService.findOne.mockResolvedValue(null);

      await expect(controller.findOne('nonexistent-id'))
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

      const result = await controller.update(mockDocument.id, updateDocumentDto);

      expect(result).toBe(updatedDocument);
      expect(service.update).toHaveBeenCalledWith(mockDocument.id, updateDocumentDto);
      expect(service.update).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException when updating non-existent document', async () => {
      mockDocumentService.update.mockResolvedValue(null);

      await expect(controller.update('nonexistent-id', { title: 'New Title' }))
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