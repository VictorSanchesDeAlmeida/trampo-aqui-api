import { Injectable } from '@nestjs/common';
import { CompanyRepository } from '../../domain/repositories/company.repository';
import { Company } from '../../domain/entities/company.entity';
import { PrismaService } from 'src/infra/database/prisma.service';
import { AppError } from 'src/common/response/app.error';
@Injectable()
export class PrismaCompanyRepository implements CompanyRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(company: Company): Promise<void> {
    try {
      await this.prisma.companies.create({
        data: {
          id: company.id,
          name: company.name,
          document: company.document,
          userId: company.userId,
        },
      });
    } catch {
      throw new AppError({
        message: 'Failed to create company',
        statusCode: 500,
      });
    }
  }

  async findByDocument(document: string): Promise<Company | null> {
    try {
      const company = await this.prisma.companies.findUnique({
        where: { document },
        include: { user: true },
      });

      if (!company) {
        return null;
      }

      const foundCompany = new Company(
        company.id,
        company.name,
        company.document,
        company.userId,
      );

      return foundCompany;
    } catch {
      throw new AppError({
        message: 'Database connection error',
        statusCode: 500,
      });
    }
  }

  async findById(id: string): Promise<Company | null> {
    try {
      const company = await this.prisma.companies.findUnique({
        where: { id },
        include: { user: true },
      });

      if (!company) {
        return null;
      }

      const foundCompany = new Company(
        company.id,
        company.name,
        company.document,
        company.userId,
      );

      return foundCompany;
    } catch {
      throw new AppError({
        message: 'Database connection error',
        statusCode: 500,
      });
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.prisma.companies.delete({ where: { id } });
    } catch {
      throw new AppError({
        message: 'Failed to delete company',
        statusCode: 500,
      });
    }
  }

  async update(company: Company): Promise<void> {
    try {
      await this.prisma.companies.update({
        where: { id: company.id },
        data: {
          name: company.name,
          document: company.document,
        },
      });
    } catch {
      throw new AppError({
        message: 'Failed to update company',
        statusCode: 500,
      });
    }
  }

  async findAll(page: number, limit: number): Promise<Company[]> {
    try {
      const companies = await this.prisma.companies.findMany({
        skip: (page - 1) * limit,
        take: limit,
        include: { user: true },
      });

      return companies.map((company) => {
        return new Company(
          company.id,
          company.name,
          company.document,
          company.userId,
        );
      });
    } catch {
      throw new AppError({
        message: 'Database connection error',
        statusCode: 500,
      });
    }
  }

  async findByName(
    name: string,
    page: number,
    limit: number,
  ): Promise<Company[]> {
    try {
      const companies = await this.prisma.companies.findMany({
        where: { name: { contains: name, mode: 'insensitive' } },
        skip: (page - 1) * limit,
        take: limit,
        include: { user: true },
      });

      return companies.map((company) => {
        return new Company(
          company.id,
          company.name,
          company.document,
          company.userId,
        );
      });
    } catch {
      throw new AppError({
        message: 'Database connection error',
        statusCode: 500,
      });
    }
  }

  async findByUserId(
    userId: string,
    page: number,
    limit: number,
  ): Promise<Company[]> {
    try {
      const companies = await this.prisma.companies.findMany({
        where: { userId },
        skip: (page - 1) * limit,
        take: limit,
        include: { user: true },
      });

      return companies.map((company) => {
        return new Company(
          company.id,
          company.name,
          company.document,
          company.userId,
        );
      });
    } catch {
      throw new AppError({
        message: 'Database connection error',
        statusCode: 500,
      });
    }
  }
}
