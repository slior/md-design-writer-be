import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DocumentEntity } from './document.entity'
import { Document } from '../document.interface'
import { DocumentStore } from '../document.store';

/*

    While Document and DocumentEntity are pretty similar, we keep them separate, and convert between the two, 
    so we avoid coupling the nest repository implementation from the pure application interfaces.
 */


function toDocumentEntity(d : Partial<Document>) : Partial<DocumentEntity>
{
    let ret = new DocumentEntity()
    ret.author = d.author
    ret.content = d.content
    // ret.id = d.id //id is auto-generated in postgres store
    ret.title = d.title
    ret.createdAt = d.createdAt
    ret.updatedAt = d.updatedAt
    
    return ret;
}

function toDocument(d : DocumentEntity | undefined) : Document
{
    let ret : Document = {
        id : d.id,
        title : d.title,
        author : d.author,
        content : d.content,
        updatedAt : d.updatedAt,
        createdAt : d.createdAt
    }
    return ret;
}

@Injectable()
export class PostgreSQLDocumentStore implements DocumentStore
{
  private readonly logger : Logger = new Logger(PostgreSQLDocumentStore.name)

  constructor(
    @InjectRepository(DocumentEntity)
    private documentRepository: Repository<DocumentEntity>,
  ) {}

  async insertDocument(document: Partial<Document>): Promise<Document>
  {
    try
    {
      const { id, ...documentData} = document;
      if (id)
      {
        this.logger.warn(`Trying to create a document with a given id, ignoring it`)
      }
      // this.logger.debug(`Insert doc, received: ${document}`)
      const newDocument = this.documentRepository.create(toDocumentEntity(documentData));
      this.logger.debug(`Insert doc, new doc: ${document}`)
      let ent = await this.documentRepository.save(newDocument);
      this.logger.debug(`Repository returned: ${JSON.stringify(ent)}`)
      return toDocument(ent)
    }
    catch (exn)
    {
      this.logger.error(exn.toString())
      throw exn
    }
  }

  async findDocumentById(id: string): Promise<Document | null>
  {
    let docEnt = await this.documentRepository.findOne({ where: { id } });
    return toDocument(docEnt)
  }

  async listDocuments(): Promise<Document[]>
  {
    let ret = (await this.documentRepository.find()).map(ent => toDocument(ent))
    this.logger.debug(`Retrieved ${ret.length} records`)
    return ret;
  }

  async updateDocument(id: string, document: Partial<Document>): Promise<Document | null>
  {
    let existingDocument = await this.documentRepository.findOne({ where: { id} });

    if (!existingDocument) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }
    const mergedDoc = this.documentRepository.merge( existingDocument,document)
    this.logger.debug(`Merged doc: ${JSON.stringify(mergedDoc)}`)
    return this.documentRepository
                .save(mergedDoc)
                .then((de : DocumentEntity) => toDocument(de))
  }

  async deleteDocument(id: string): Promise<void>
  {
    await this.documentRepository.delete(id);
  }
}