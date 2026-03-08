import { Body, Controller, Post } from '@nestjs/common';
import { CreateCompanyUseCase } from '../../application/use-case/create-company.usecase';
import { CreateCompanyDto } from '../dtos/create-company.dto';
import { CreateCompanyMapper } from '../mappers/create-company.mapper';
import { Roles } from 'src/common/decorator/roles.decorator';
import { UserRole } from 'src/common/enums/user-role.enum';
import { AppResponse } from 'src/common/response/app.response';

@Controller('companies')
export class CompanyController {
  constructor(private readonly createCompanyUseCase: CreateCompanyUseCase) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.USER)
  async createCompany(@Body() createCompanyDto: CreateCompanyDto) {
    const newCompany = CreateCompanyMapper.toEntity(createCompanyDto);
    const createdCompany = await this.createCompanyUseCase.execute(newCompany);

    return new AppResponse({
      message: 'Company created successfully',
      statusCode: 201,
      data: createdCompany,
    });
  }
}
