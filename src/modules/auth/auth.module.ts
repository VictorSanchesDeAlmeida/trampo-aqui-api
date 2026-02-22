import { Module } from '@nestjs/common';
import { LoginUseCase } from './application/use-cases/login.usecase';
import { UserRepository } from '../users/domain/repositories/user.repository';
import { PrismaUserRepository } from '../users/infra/repositories/prisma-user.repository';
import { AuthController } from './presentation/controllers/auth.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: 'your-secret-key',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    LoginUseCase,
    {
      provide: UserRepository,
      useClass: PrismaUserRepository, // You should replace this with the actual implementation of UserRepository
    },
  ],
})
export class AuthModule {}
