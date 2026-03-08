import { Body, Controller, Post } from '@nestjs/common';
import { CreateCompanyUseCase } from '../../application/use-case/create-company.usecase';
import { CreateCompanyDto } from '../dtos/create-company.dto';
import { CreateCompanyMapper } from '../mappers/create-company.mapper';

@Controller('companies')
export class CompanyController {
  constructor(private readonly createCompanyUseCase: CreateCompanyUseCase) {}

  @Post()
  async createCompany(@Body() createCompanyDto: CreateCompanyDto) {
    const newCompany = CreateCompanyMapper.toEntity(createCompanyDto);
    await this.createCompanyUseCase.execute(newCompany);

    return {
      message: 'Company created successfully',
      statusCode: 201,
    };
  }
}
