import { Course } from '../../domain/entities/course.entity';
import { UpdateCourseDto } from '../dtos/update-course.dto';

export class UpdateCourseMapper {
  static toEntity(id: string, dto: UpdateCourseDto, existingCourse: Course): Course {
    return new Course(
      id,
      dto.title ?? existingCourse.title,
      dto.description ?? existingCourse.description,
      dto.link ?? existingCourse.link,
      existingCourse.companyId,
      existingCourse.createdAt,
    );
  }
}