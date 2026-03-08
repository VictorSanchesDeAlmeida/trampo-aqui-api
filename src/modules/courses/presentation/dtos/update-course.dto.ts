import { IsOptional, IsString, MinLength, MaxLength, IsUrl } from 'class-validator';

export class UpdateCourseDto {
  @IsOptional()
  @IsString({ message: 'Title must be a string' })
  @MinLength(3, { message: 'Title must have at least 3 characters' })
  @MaxLength(255, { message: 'Title must not exceed 255 characters' })
  title?: string;

  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  @MinLength(10, { message: 'Description must have at least 10 characters' })
  @MaxLength(500, { message: 'Description must not exceed 500 characters' })
  description?: string;

  @IsOptional()
  @IsString({ message: 'Link must be a string' })
  @IsUrl({}, { message: 'Link must be a valid URL' })
  @MaxLength(255, { message: 'Link must not exceed 255 characters' })
  link?: string;
}