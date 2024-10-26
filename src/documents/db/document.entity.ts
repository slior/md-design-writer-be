import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Document } from '../document.interface';
import { User } from '../../users/user.entity';

@Entity('Documents')
export class DocumentEntity implements Document
{
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  content: string;

  // @Column()
  // author : string;
  @ManyToOne(() => User)
  author : User;

  // @ManyToOne(() => User)
  // authorID : User;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}