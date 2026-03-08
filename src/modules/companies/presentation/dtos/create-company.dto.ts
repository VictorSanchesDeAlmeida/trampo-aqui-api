import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateCompanyDto {
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  @MinLength(3, { message: 'Name must have at least 3 characters' })
  name: string;

  @IsNotEmpty({ message: 'Document is required' })
  @IsString({ message: 'Document must be a string' })
  @MinLength(11, { message: 'Document must have at least 11 characters' })
  document: string;

  @IsNotEmpty({ message: 'User ID is required' })
  @IsString({ message: 'User ID must be a string' })
  userId: string;
}
