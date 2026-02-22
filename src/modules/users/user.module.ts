import { Module } from '@nestjs/common';
import { UserController } from './presentation/controllers/user.controller';
import { CreateUserUseCase } from './application/use-cases/create-user.usecase';
import { PrismaUserRepository } from './infra/repositories/prisma-user.repository';
import { UserRepository } from './domain/repositories/user.repository';

@Module({
  controllers: [UserController],
  providers: [
    CreateUserUseCase,
    {
      provide: UserRepository,
      useClass: PrismaUserRepository,
    },
  ],
})
export class UserModule {}
