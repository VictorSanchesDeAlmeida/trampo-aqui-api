import { Job } from '../entities/job.entity';

export abstract class JobRepository {
  abstract create(job: Job): Promise<void>;
  abstract findById(id: string): Promise<Job | null>;
  abstract findByCompanyId(
    companyId: string,
    page: number,
    limit: number,
  ): Promise<Job[]>;
  abstract findAll(page: number, limit: number): Promise<Job[]>;
  abstract searchByTitle(
    title: string,
    page: number,
    limit: number,
  ): Promise<Job[]>;
  abstract update(job: Job): Promise<void>;
  abstract delete(id: string): Promise<void>;
  abstract countByCompanyId(companyId: string): Promise<number>;
  abstract countAll(): Promise<number>;
}
