import { Body, Controller, Get, Post, Put, Delete, Query, Param } from '@nestjs/common';
import { CreateCourseUseCase } from '../../application/use-cases/create-course.usecase';
import { UpdateCourseUseCase } from '../../application/use-cases/update-course.usecase';
import { DeleteCourseUseCase } from '../../application/use-cases/delete-course.usecase';
import { CreateCourseDto } from '../dtos/create-course.dto';
import { UpdateCourseDto } from '../dtos/update-course.dto';
import { CreateCourseMapper } from '../mappers/create-course.mapper';
import { UpdateCourseMapper } from '../mappers/update-course.mapper';
import { CourseRepository } from '../../domain/repositories/course.repository';
import { CourseResponseDto } from '../dtos/course-response.dto';
import { Public } from 'src/common/decorator/is-public';
import { Roles } from 'src/common/decorator/roles.decorator';
import { UserRole } from 'src/common/enums/user-role.enum';
import { AppError } from 'src/common/response/app.error';

@Controller('courses')
export class CourseController {
  constructor(
    private readonly createCourseUseCase: CreateCourseUseCase,
    private readonly updateCourseUseCase: UpdateCourseUseCase,
    private readonly deleteCourseUseCase: DeleteCourseUseCase,
    private readonly courseRepository: CourseRepository,
  ) {}

  @Post()
  @Roles(UserRole.COMPANY)
  async createCourse(@Body() createCourseDto: CreateCourseDto) {
    const newCourse = CreateCourseMapper.toEntity(createCourseDto);
    await this.createCourseUseCase.execute(newCourse);

    return {
      message: 'Course created successfully',
      statusCode: 201,
    };
  }

  @Public()
  @Get()
  async findAllCourses(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('title') title?: string,
    @Query('companyId') companyId?: string,
  ) {
    const pageNumber = Math.max(1, parseInt(page) || 1);
    const limitNumber = Math.min(50, Math.max(1, parseInt(limit) || 10));

    let courses;

    if (title) {
      courses = await this.courseRepository.searchByTitle(title, pageNumber, limitNumber);
    } else if (companyId) {
      courses = await this.courseRepository.findByCompanyId(companyId, pageNumber, limitNumber);
    } else {
      courses = await this.courseRepository.findAll(pageNumber, limitNumber);
    }

    const courseResponses = courses.map(course => new CourseResponseDto(
      course.id,
      course.title,
      course.description,
      course.link,
      course.companyId,
      course.createdAt,
    ));

    const totalCourses = title ? undefined : 
      companyId ? await this.courseRepository.countByCompanyId(companyId) :
      await this.courseRepository.countAll();

    return {
      message: 'Courses retrieved successfully',
      statusCode: 200,
      data: courseResponses,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        total: totalCourses,
        totalPages: totalCourses ? Math.ceil(totalCourses / limitNumber) : undefined,
      },
    };
  }

  @Public()
  @Get(':id')
  async findCourseById(@Param('id') id: string) {
    const course = await this.courseRepository.findById(id);

    if (!course) {
      throw new AppError({
        message: 'Course not found',
        statusCode: 404,
      });
    }

    const courseResponse = new CourseResponseDto(
      course.id,
      course.title,
      course.description,
      course.link,
      course.companyId,
      course.createdAt,
    );

    return {
      message: 'Course retrieved successfully',
      statusCode: 200,
      data: courseResponse,
    };
  }

  @Put(':id')
  @Roles(UserRole.COMPANY)
  async updateCourse(
    @Param('id') id: string,
    @Body() updateCourseDto: UpdateCourseDto,
  ) {
    // Buscar curso existente
    const existingCourse = await this.courseRepository.findById(id);
    if (!existingCourse) {
      throw new AppError({
        message: 'Course not found',
        statusCode: 404,
      });
    }

    // Mapear para entidade atualizada
    const updatedCourse = UpdateCourseMapper.toEntity(id, updateCourseDto, existingCourse);
    
    // Executar use case
    await this.updateCourseUseCase.execute(id, updatedCourse);

    return {
      message: 'Course updated successfully',
      statusCode: 200,
    };
  }

  @Delete(':id')
  @Roles(UserRole.COMPANY, UserRole.ADMIN)
  async deleteCourse(@Param('id') id: string) {
    await this.deleteCourseUseCase.execute(id);

    return {
      message: 'Course deleted successfully',
      statusCode: 200,
    };
  }
}