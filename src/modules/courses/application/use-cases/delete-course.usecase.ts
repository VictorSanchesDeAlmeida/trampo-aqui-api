import { Injectable } from '@nestjs/common';
import { CourseRepository } from '../../domain/repositories/course.repository';
import { AppError } from 'src/common/response/app.error';

@Injectable()
export class DeleteCourseUseCase {
  constructor(
    private readonly courseRepository: CourseRepository,
  ) {}

  async execute(id: string): Promise<void> {
    // Verificar se o curso existe
    const existingCourse = await this.courseRepository.findById(id);

    if (!existingCourse) {
      throw new AppError({
        message: 'Course not found',
        statusCode: 404,
      });
    }

    try {
      // Deletar o curso
      await this.courseRepository.delete(id);
    } catch (error) {
      // Re-throw AppError sem modificar
      if (error instanceof AppError) {
        throw error;
      }

      // Erro genérico de banco de dados ou sistema
      throw new AppError({
        message: 'Failed to delete course',
        statusCode: 500,
      });
    }
  }
}