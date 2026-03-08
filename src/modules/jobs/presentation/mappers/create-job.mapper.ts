import { randomUUID } from 'crypto';
import { Job } from '../../domain/entities/job.entity';
import { CreateJobDto } from '../dtos/create-job.dto';

export class CreateJobMapper {
  static toEntity(dto: CreateJobDto): Job {
    return new Job(randomUUID(), dto.title, dto.description, dto.companyId);
  }
}
