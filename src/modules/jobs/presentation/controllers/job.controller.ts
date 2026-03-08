import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CreateJobUseCase } from '../../application/use-cases/create-job.usecase';
import { CreateJobDto } from '../dtos/create-job.dto';
import { CreateJobMapper } from '../mappers/create-job.mapper';
import { JobRepository } from '../../domain/repositories/job.repository';
import { JobResponseDto } from '../dtos/job-response.dto';
import { Public } from 'src/common/decorator/is-public';
import { Job } from '../../domain/entities/job.entity';
import { Roles } from 'src/common/decorator/roles.decorator';
import { UserRole } from 'src/common/enums/user-role.enum';
import { AppResponse } from 'src/common/response/app.response';

@Controller('jobs')
export class JobController {
  constructor(
    private readonly createJobUseCase: CreateJobUseCase,
    private readonly jobRepository: JobRepository,
  ) {}

  @Post()
  @Roles(UserRole.COMPANY)
  async createJob(@Body() createJobDto: CreateJobDto) {
    const newJob = CreateJobMapper.toEntity(createJobDto);
    await this.createJobUseCase.execute(newJob);

    return new AppResponse({
      message: 'Job created successfully',
      statusCode: 201,
      data: null,
    });
  }

  @Public()
  @Get()
  async findAllJobs(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('title') title?: string,
    @Query('companyId') companyId?: string,
  ) {
    const pageNumber = Math.max(1, parseInt(page) || 1);
    const limitNumber = Math.min(50, Math.max(1, parseInt(limit) || 10));

    let jobs: Job[] = [];

    if (title) {
      jobs = await this.jobRepository.searchByTitle(
        title,
        pageNumber,
        limitNumber,
      );
    } else if (companyId) {
      jobs = await this.jobRepository.findByCompanyId(
        companyId,
        pageNumber,
        limitNumber,
      );
    } else {
      jobs = await this.jobRepository.findAll(pageNumber, limitNumber);
    }

    const jobResponses = jobs.map(
      (job) =>
        new JobResponseDto(job.id, job.title, job.description, job.companyId),
    );

    const totalJobs = title
      ? undefined
      : companyId
        ? await this.jobRepository.countByCompanyId(companyId)
        : await this.jobRepository.countAll();

    return new AppResponse({
      message: 'Jobs retrieved successfully',
      statusCode: 200,
      data: {
        items: jobResponses,
        pagination: {
          page: pageNumber,
          limit: limitNumber,
          total: totalJobs,
          totalPages: totalJobs ? Math.ceil(totalJobs / limitNumber) : undefined,
        },
      },
    });
  }
}
