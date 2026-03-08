import { Module } from '@nestjs/common';
import { LoginUseCase } from './application/use-cases/login.usecase';
import { UserRepository } from '../users/domain/repositories/user.repository';
import { PrismaUserRepository } from '../users/infra/repositories/prisma-user.repository';
import { AuthController } from './presentation/controllers/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
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
