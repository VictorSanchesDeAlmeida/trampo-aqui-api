import { Company } from '../entities/company.entity';

export abstract class CompanyRepository {
  abstract create(company: Company): Promise<void>;
  abstract findById(id: string): Promise<Company | null>;
  abstract findByDocument(document: string): Promise<Company | null>;
  abstract findByUserId(userId: string): Promise<Company | null>;
  abstract delete(id: string): Promise<void>;
  abstract update(company: Company): Promise<void>;
  abstract findAll(page: number, limit: number): Promise<Company[]>;
  abstract findByName(
    name: string,
    page: number,
    limit: number,
  ): Promise<Company[]>;
}
