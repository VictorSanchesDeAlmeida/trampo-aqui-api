import { randomUUID } from 'crypto';
import { Course } from '../../domain/entities/course.entity';
import { CreateCourseDto } from '../dtos/create-course.dto';

export class CreateCourseMapper {
  static toEntity(dto: CreateCourseDto): Course {
    return new Course(
      randomUUID(),
      dto.title,
      dto.description,
      dto.link,
      dto.companyId,
    );
  }
}