import { Injectable } from '@nestjs/common';
import { Job } from '../../domain/entities/job.entity';
import { JobRepository } from '../../domain/repositories/job.repository';
import { CompanyRepository } from 'src/modules/companies/domain/repositories/company.repository';
import { AppError } from 'src/common/response/app.error';

@Injectable()
export class CreateJobUseCase {
  constructor(
    private readonly jobRepository: JobRepository,
    private readonly companyRepository: CompanyRepository,
  ) {}

  async execute(job: Job): Promise<void> {
    // Verificar se a empresa existe
    const company = await this.companyRepository.findById(job.companyId);

    if (!company) {
      throw new AppError({
        message: 'Company not found',
        statusCode: 404,
      });
    }

    try {
      // Crear a vaga
      await this.jobRepository.create(job);
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
        message: 'Failed to create job',
        statusCode: 500,
      });
    }
  }
}
