import { Injectable } from '@nestjs/common';
import { Course } from '../../domain/entities/course.entity';
import { CourseRepository } from '../../domain/repositories/course.repository';
import { CompanyRepository } from 'src/modules/companies/domain/repositories/company.repository';
import { AppError } from 'src/common/response/app.error';

@Injectable()
export class CreateCourseUseCase {
  constructor(
    private readonly courseRepository: CourseRepository,
    private readonly companyRepository: CompanyRepository,
  ) {}

  async execute(course: Course): Promise<void> {
    // Verificar se a empresa existe
    const company = await this.companyRepository.findById(course.companyId);

    if (!company) {
      throw new AppError({
        message: 'Company not found',
        statusCode: 404,
      });
    }

    try {
      // Criar o curso
      await this.courseRepository.create(course);
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
        message: 'Failed to create course',
        statusCode: 500,
      });
    }
  }
}