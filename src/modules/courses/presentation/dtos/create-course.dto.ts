import { IsNotEmpty, IsString, MinLength, MaxLength, IsUUID, IsUrl } from 'class-validator';

export class CreateCourseDto {
  @IsNotEmpty({ message: 'Title is required' })
  @IsString({ message: 'Title must be a string' })
  @MinLength(3, { message: 'Title must have at least 3 characters' })
  @MaxLength(255, { message: 'Title must not exceed 255 characters' })
  title: string;

  @IsNotEmpty({ message: 'Description is required' })
  @IsString({ message: 'Description must be a string' })
  @MinLength(10, { message: 'Description must have at least 10 characters' })
  @MaxLength(500, { message: 'Description must not exceed 500 characters' })
  description: string;

  @IsNotEmpty({ message: 'Link is required' })
  @IsString({ message: 'Link must be a string' })
  @IsUrl({}, { message: 'Link must be a valid URL' })
  @MaxLength(255, { message: 'Link must not exceed 255 characters' })
  link: string;

  @IsNotEmpty({ message: 'Company ID is required' })
  @IsString({ message: 'Company ID must be a string' })
  @IsUUID('4', { message: 'Company ID must be a valid UUID' })
  companyId: string;
}