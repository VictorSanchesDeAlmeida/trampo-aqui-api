import { Module } from '@nestjs/common';
import { CompanyRepository } from './domain/repositories/company.repository';
import { PrismaCompanyRepository } from './infra/repositories/prisma-company.repository';
import { CompanyController } from './presentation/controllers/company.controller';
import { UserRepository } from '../users/domain/repositories/user.repository';
import { PrismaUserRepository } from '../users/infra/repositories/prisma-user.repository';
import { CreateCompanyUseCase } from './application/use-case/create-company.usecase';

@Module({
  controllers: [CompanyController],
  providers: [
    CreateCompanyUseCase,
    {
      provide: CompanyRepository,
      useClass: PrismaCompanyRepository,
    },
    {
      provide: UserRepository,
      useClass: PrismaUserRepository,
    },
  ],
})
export class CompaniesModule {}
