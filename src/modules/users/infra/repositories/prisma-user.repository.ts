import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';
import { User } from '../../domain/entities/user.entity';
import { UserRepository } from '../../domain/repositories/user.repository';
import { AppError } from 'src/common/response/app.error';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(user: User): Promise<User> {
    try {
      const createdUser = await this.prisma.user.create({
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          document: user.document,
          birthDate: user.birthDate,
          password: user.password,
          createdAt: user.createdAt,
          roleId: user.role,
        },
      });

      return new User(
        createdUser.id,
        createdUser.name,
        createdUser.email,
        createdUser.document,
        createdUser.birthDate,
        createdUser.password,
        createdUser.roleId,
        createdUser.createdAt,
      );
    } catch {
      throw new AppError({
        message: 'Failed to create user',
        statusCode: 500,
      });
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      const user = await this.prisma.user.findUnique({ where: { email } });

      if (!user) {
        return null;
      }

      const foundUser = new User(
        user.id,
        user.name,
        user.email,
        user.document,
        user.birthDate,
        user.password,
        user.roleId,
        user.createdAt,
      );

      return foundUser;
    } catch {
      throw new AppError({
        message: 'Database connection error',
        statusCode: 500,
      });
    }
  }

  async findById(id: string): Promise<User | null> {
    try {
      const user = await this.prisma.user.findUnique({ where: { id } });

      if (!user) {
        return null;
      }

      const foundUser = new User(
        user.id,
        user.name,
        user.email,
        user.document,
        user.birthDate,
        user.password,
        user.roleId,
        user.createdAt,
      );

      return foundUser;
    } catch {
      throw new AppError({
        message: 'Failed to find user by ID',
        statusCode: 500,
      });
    }
  }
}
