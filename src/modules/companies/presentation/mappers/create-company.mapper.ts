import { randomUUID } from 'crypto';
import { Company } from '../../domain/entities/company.entity';
import { CreateCompanyDto } from '../dtos/create-company.dto';

export class CreateCompanyMapper {
  static toEntity(dto: CreateCompanyDto) {
    return new Company(randomUUID(), dto.name, dto.document, dto.userId);
  }
}
