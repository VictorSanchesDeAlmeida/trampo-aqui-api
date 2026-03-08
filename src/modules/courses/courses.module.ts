import { Module } from '@nestjs/common';
import { CourseRepository } from './domain/repositories/course.repository';
import { PrismaCourseRepository } from './infra/repositories/prisma-course.repository';
import { CourseController } from './presentation/controllers/course.controller';
import { CompanyRepository } from '../companies/domain/repositories/company.repository';
import { PrismaCompanyRepository } from '../companies/infra/repositories/prisma-company.repository';
import { CreateCourseUseCase } from './application/use-cases/create-course.usecase';
import { UpdateCourseUseCase } from './application/use-cases/update-course.usecase';
import { DeleteCourseUseCase } from './application/use-cases/delete-course.usecase';

@Module({
  controllers: [CourseController],
  providers: [
    CreateCourseUseCase,
    UpdateCourseUseCase,
    DeleteCourseUseCase,
    {
      provide: CourseRepository,
      useClass: PrismaCourseRepository,
    },
    {
      provide: CompanyRepository,
      useClass: PrismaCompanyRepository,
    },
  ],
})
export class CoursesModule {}