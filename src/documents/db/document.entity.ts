import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Document } from '../document.interface';

@Entity('Documents')
export class DocumentEntity implements Document {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  content: string;

  @Column()
  author : string;
  // @Column('jsonb', { nullable: true })
  // metadata: any;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}