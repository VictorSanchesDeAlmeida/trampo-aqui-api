import { Course } from '../entities/course.entity';

export abstract class CourseRepository {
  abstract create(course: Course): Promise<void>;
  abstract findById(id: string): Promise<Course | null>;
  abstract findByCompanyId(
    companyId: string,
    page: number,
    limit: number,
  ): Promise<Course[]>;
  abstract findAll(page: number, limit: number): Promise<Course[]>;
  abstract searchByTitle(
    title: string,
    page: number,
    limit: number,
  ): Promise<Course[]>;
  abstract update(course: Course): Promise<void>;
  abstract delete(id: string): Promise<void>;
  abstract countByCompanyId(companyId: string): Promise<number>;
  abstract countAll(): Promise<number>;
}