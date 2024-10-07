import { Controller, Get, Post, Put, Param, Body, NotFoundException, Logger } from '@nestjs/common';
import { DocumentService } from './document.service';
import { CreateDocumentDto, UpdateDocumentDto } from './document.dto';
import { Document } from './document.interface';

const dbg = (s) => {
  console.log(s || '')
}

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
  async findOne(@Param('id') id: string): Promise<Document>
  {
    const document = await this.documentService.findOne(id);
    if (!document) {
      dbg (`Failed to retrieve document ${id}`)
      throw new NotFoundException(`Document with ID ${id} not found`);
    }
    dbg(`retrieving document ${id}`)
    return document;
  }

  @Post()
  async create(@Body() createDocumentDto: CreateDocumentDto): Promise<Document>
  {
    let doc = this.documentService.create(createDocumentDto);
    this.logger.debug(`Create, doc returned = ${JSON.stringify(doc)}`)
    return doc
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDocumentDto: UpdateDocumentDto): Promise<Document>
  {
    dbg(`Updating document ${id}`)
    const updatedDocument = await this.documentService.update(id, updateDocumentDto);
    if (!updatedDocument)
    {
      dbg(`Failed to update ${id}`)
      throw new NotFoundException(`Document with ID ${id} not found`);
    }
    dbg(`Success updating ${id}`)
    return updatedDocument;
  }
}