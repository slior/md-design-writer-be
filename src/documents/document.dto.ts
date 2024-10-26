import { IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';

export class CreateDocumentDto
{
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  title: string;

  @IsString()
  content: string;

  @IsNotEmpty()
  @IsString()
  authorID: string;
}

export class UpdateDocumentDto 
{
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  title?: string;

  @IsString()
  content?: string;

  @IsNotEmpty()
  @IsString()
  author?: string;
}