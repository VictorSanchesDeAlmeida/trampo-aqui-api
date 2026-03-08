import { Module } from '@nestjs/common';
import { JobRepository } from './domain/repositories/job.repository';
import { PrismaJobRepository } from './infra/repositories/prisma-job.repository';
import { JobController } from './presentation/controllers/job.controller';
import { CompanyRepository } from '../companies/domain/repositories/company.repository';
import { PrismaCompanyRepository } from '../companies/infra/repositories/prisma-company.repository';
import { CreateJobUseCase } from './application/use-cases/create-job.usecase';

@Module({
  controllers: [JobController],
  providers: [
    CreateJobUseCase,
    {
      provide: JobRepository,
      useClass: PrismaJobRepository,
    },
    {
      provide: CompanyRepository,
      useClass: PrismaCompanyRepository,
    },
  ],
})
export class JobsModule {}
