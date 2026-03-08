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

  async execute(company: Company): Promise<void> {
    const user = await this.userRepository.findById(company.userId);

    if (!user) {
      throw new AppError({
        message: 'User not found',
        statusCode: 404,
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

    await this.companyRepository.create(company);
  }
}
