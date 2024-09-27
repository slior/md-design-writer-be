import { Controller, Get, Post, Put, Param, Body, NotFoundException } from '@nestjs/common';
import { DocumentService } from './document.service';
import { CreateDocumentDto, UpdateDocumentDto } from './document.dto';
import { Document } from './document.interface';

@Controller('documents')
export class DocumentController
{
  constructor(private readonly documentService: DocumentService) {}

  @Get()
  async findAll(): Promise<Document[]> {
    return this.documentService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Document> {
    const document = await this.documentService.findOne(id);
    if (!document) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }
    return document;
  }

  @Post()
  async create(@Body() createDocumentDto: CreateDocumentDto): Promise<Document> {
    return this.documentService.create(createDocumentDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDocumentDto: UpdateDocumentDto): Promise<Document> {
    const updatedDocument = await this.documentService.update(id, updateDocumentDto);
    if (!updatedDocument) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }
    return updatedDocument;
  }
}