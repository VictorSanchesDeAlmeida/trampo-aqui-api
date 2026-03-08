import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';
import { Job } from '../../domain/entities/job.entity';
import { JobRepository } from '../../domain/repositories/job.repository';
import { AppError } from 'src/common/response/app.error';

@Injectable()
export class PrismaJobRepository implements JobRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(job: Job): Promise<void> {
    try {
      await this.prisma.jobs.create({
        data: {
          id: job.id,
          title: job.title,
          description: job.description,
          companyId: job.companyId,
        },
      });
    } catch {
      throw new AppError({
        message: 'Failed to create job',
        statusCode: 500,
      });
    }
  }

  async findById(id: string): Promise<Job | null> {
    try {
      const job = await this.prisma.jobs.findUnique({
        where: { id },
        include: {
          company: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      if (!job) {
        return null;
      }

      return new Job(job.id, job.title, job.description, job.companyId);
    } catch {
      throw new AppError({
        message: 'Database connection error',
        statusCode: 500,
      });
    }
  }

  async findByCompanyId(
    companyId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<Job[]> {
    try {
      const skip = (page - 1) * limit;

      const jobs = await this.prisma.jobs.findMany({
        where: { companyId },
        skip,
        take: limit,
        orderBy: { id: 'desc' },
      });

      return jobs.map(
        (job) => new Job(job.id, job.title, job.description, job.companyId),
      );
    } catch {
      throw new AppError({
        message: 'Failed to fetch jobs by company',
        statusCode: 500,
      });
    }
  }

  async findAll(page: number = 1, limit: number = 10): Promise<Job[]> {
    try {
      const skip = (page - 1) * limit;

      const jobs = await this.prisma.jobs.findMany({
        skip,
        take: limit,
        orderBy: { id: 'desc' },
        include: {
          company: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      return jobs.map(
        (job) => new Job(job.id, job.title, job.description, job.companyId),
      );
    } catch {
      throw new AppError({
        message: 'Failed to fetch jobs',
        statusCode: 500,
      });
    }
  }

  async searchByTitle(
    title: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<Job[]> {
    try {
      const skip = (page - 1) * limit;

      const jobs = await this.prisma.jobs.findMany({
        where: {
          title: {
            contains: title,
            mode: 'insensitive',
          },
        },
        skip,
        take: limit,
        orderBy: { id: 'desc' },
        include: {
          company: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      return jobs.map(
        (job) => new Job(job.id, job.title, job.description, job.companyId),
      );
    } catch {
      throw new AppError({
        message: 'Failed to search jobs',
        statusCode: 500,
      });
    }
  }

  async update(job: Job): Promise<void> {
    try {
      await this.prisma.jobs.update({
        where: { id: job.id },
        data: {
          title: job.title,
          description: job.description,
          companyId: job.companyId,
        },
      });
    } catch {
      throw new AppError({
        message: 'Failed to update job',
        statusCode: 500,
      });
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.prisma.jobs.delete({
        where: { id },
      });
    } catch {
      throw new AppError({
        message: 'Failed to delete job',
        statusCode: 500,
      });
    }
  }

  async countByCompanyId(companyId: string): Promise<number> {
    try {
      return await this.prisma.jobs.count({
        where: { companyId },
      });
    } catch {
      throw new AppError({
        message: 'Failed to count jobs by company',
        statusCode: 500,
      });
    }
  }

  async countAll(): Promise<number> {
    try {
      return await this.prisma.jobs.count();
    } catch {
      throw new AppError({
        message: 'Failed to count jobs',
        statusCode: 500,
      });
    }
  }
}
