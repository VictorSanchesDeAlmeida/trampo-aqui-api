import { Injectable } from '@nestjs/common';
import { Company } from '../../domain/entities/company.entity';
import { CompanyRepository } from '../../domain/repositories/company.repository';
import { UserRepository } from 'src/modules/users/domain/repositories/user.repository';
import { AppError } from 'src/common/response/app.error';

@Injectable()
export class CreateCompanyUseCase {
  constructor(
    private readonly companyRepository: CompanyRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute(company: Company) {
    const user = await this.userRepository.findById(company.userId);

    if (!user) {
      throw new AppError({
        message: 'User not found',
        statusCode: 404,
      });
    }

    // Verificar se o usuário tem role USER (2) ou ADMIN (1)
    if (user.role !== 2 && user.role !== 1) {
      throw new AppError({
        message: 'Only users with USER or ADMIN role can create companies',
        statusCode: 403,
      });
    }

    const existingCompany = await this.companyRepository.findByDocument(
      company.document,
    );

    if (existingCompany) {
      throw new AppError({
        message: 'Document already in use',
        statusCode: 400,
      });
    }

    // Criar a empresa primeiro
    await this.companyRepository.create(company);

    // Se o usuário era USER (2), alterar para COMPANY (3)
    if (user.role === 2) {
      user.setRole(3);
      await this.userRepository.update(user);
    }

    return company;
  }
}
