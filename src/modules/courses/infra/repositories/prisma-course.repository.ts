import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';
import { Course } from '../../domain/entities/course.entity';
import { CourseRepository } from '../../domain/repositories/course.repository';
import { AppError } from 'src/common/response/app.error';

@Injectable()
export class PrismaCourseRepository implements CourseRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(course: Course): Promise<void> {
    try {
      await this.prisma.courses.create({
        data: {
          id: course.id,
          title: course.title,
          description: course.description,
          link: course.link,
          companyId: course.companyId,
          createdAt: course.createdAt,
        },
      });
    } catch (error) {
      throw new AppError({
        message: 'Failed to create course',
        statusCode: 500,
      });
    }
  }

  async findById(id: string): Promise<Course | null> {
    try {
      const course = await this.prisma.courses.findUnique({ 
        where: { id },
        include: {
          company: {
            select: {
              id: true,
              name: true,
            }
          }
        }
      });

      if (!course) {
        return null;
      }

      return new Course(
        course.id,
        course.title,
        course.description,
        course.link,
        course.companyId,
        course.createdAt,
      );
    } catch (error) {
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
  ): Promise<Course[]> {
    try {
      const skip = (page - 1) * limit;
      
      const courses = await this.prisma.courses.findMany({
        where: { companyId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      });

      return courses.map(course => new Course(
        course.id,
        course.title,
        course.description,
        course.link,
        course.companyId,
        course.createdAt,
      ));
    } catch (error) {
      throw new AppError({
        message: 'Failed to fetch courses by company',
        statusCode: 500,
      });
    }
  }

  async findAll(page: number = 1, limit: number = 10): Promise<Course[]> {
    try {
      const skip = (page - 1) * limit;
      
      const courses = await this.prisma.courses.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          company: {
            select: {
              id: true,
              name: true,
            }
          }
        }
      });

      return courses.map(course => new Course(
        course.id,
        course.title,
        course.description,
        course.link,
        course.companyId,
        course.createdAt,
      ));
    } catch (error) {
      throw new AppError({
        message: 'Failed to fetch courses',
        statusCode: 500,
      });
    }
  }

  async searchByTitle(
    title: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<Course[]> {
    try {
      const skip = (page - 1) * limit;
      
      const courses = await this.prisma.courses.findMany({
        where: {
          title: {
            contains: title,
            mode: 'insensitive',
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          company: {
            select: {
              id: true,
              name: true,
            }
          }
        }
      });

      return courses.map(course => new Course(
        course.id,
        course.title,
        course.description,
        course.link,
        course.companyId,
        course.createdAt,
      ));
    } catch (error) {
      throw new AppError({
        message: 'Failed to search courses',
        statusCode: 500,
      });
    }
  }

  async update(course: Course): Promise<void> {
    try {
      await this.prisma.courses.update({
        where: { id: course.id },
        data: {
          title: course.title,
          description: course.description,
          link: course.link,
          companyId: course.companyId,
        },
      });
    } catch (error) {
      throw new AppError({
        message: 'Failed to update course',
        statusCode: 500,
      });
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.prisma.courses.delete({
        where: { id },
      });
    } catch (error) {
      throw new AppError({
        message: 'Failed to delete course',
        statusCode: 500,
      });
    }
  }

  async countByCompanyId(companyId: string): Promise<number> {
    try {
      return await this.prisma.courses.count({
        where: { companyId },
      });
    } catch (error) {
      throw new AppError({
        message: 'Failed to count courses by company',
        statusCode: 500,
      });
    }
  }

  async countAll(): Promise<number> {
    try {
      return await this.prisma.courses.count();
    } catch (error) {
      throw new AppError({
        message: 'Failed to count courses',
        statusCode: 500,
      });
    }
  }
}