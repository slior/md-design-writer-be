import { Controller, Get, Post, Put, Param, Body, NotFoundException, Logger, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { DocumentService } from './document.service';
import { CreateDocumentDto, UpdateDocumentDto } from './document.dto';
import { Document } from './document.interface';



@Controller('documents')
export class DocumentController
{
  private readonly logger = new Logger(DocumentController.name);
  constructor(private readonly documentService: DocumentService) {}

  @Get()
  async findAll(): Promise<Document[]>
  {
    let docs = await this.documentService.findAll();
    this.logger.debug(`Retrieved ${docs.length} documents`)
    return docs;
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string): Promise<Document>
  {
    const document = await this.documentService.findOne(id);
    if (!document) {
      this.logger.debug(`Failed to retrieve document ${id}`)
      throw new NotFoundException(`Document with ID ${id} not found`);
    }
    this.logger.debug(`retrieving document ${id}`)
    return document;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDocumentDto: CreateDocumentDto): Promise<Document>
  {
    let doc = this.documentService.create(createDocumentDto);
    this.logger.debug(`Create, doc returned = ${JSON.stringify(doc)}`)
    return doc
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: string, @Body() updateDocumentDto: UpdateDocumentDto): Promise<Document>
  {
    this.logger.debug(`Updating document ${id}`)
    const updatedDocument = await this.documentService.update(id, updateDocumentDto);
    if (!updatedDocument)
    {
      this.logger.error(`Failed to update ${id}`)
      throw new NotFoundException(`Document with ID ${id} not found`);
    }
    this.logger.log(`Success updating ${id}`)
    return updatedDocument;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) : Promise<void>
  {
      return this.documentService.delete(id)
  }
}