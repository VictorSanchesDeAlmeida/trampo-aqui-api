import { Injectable } from '@nestjs/common';
import { Course } from '../../domain/entities/course.entity';
import { CourseRepository } from '../../domain/repositories/course.repository';
import { AppError } from 'src/common/response/app.error';

@Injectable()
export class UpdateCourseUseCase {
  constructor(
    private readonly courseRepository: CourseRepository,
  ) {}

  async execute(id: string, updatedCourse: Course): Promise<void> {
    // Verificar se o curso existe
    const existingCourse = await this.courseRepository.findById(id);

    if (!existingCourse) {
      throw new AppError({
        message: 'Course not found',
        statusCode: 404,
      });
    }

    try {
      // Atualizar o curso
      await this.courseRepository.update(updatedCourse);
    } catch (error) {
      // Re-throw AppError sem modificar
      if (error instanceof AppError) {
        throw error;
      }

      // Tratar erros de validação da entidade
      if (error instanceof Error) {
        throw new AppError({
          message: error.message,
          statusCode: 400,
        });
      }

      // Erro genérico de banco de dados ou sistema
      throw new AppError({
        message: 'Failed to update course',
        statusCode: 500,
      });
    }
  }
}