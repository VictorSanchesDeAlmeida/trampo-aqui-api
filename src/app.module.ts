import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './infra/database.module';
import { UserModule } from './modules/users/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './modules/auth/infra/guard/auth.guard';
import { CompaniesModule } from './modules/companies/companies.module';
import { JobsModule } from './modules/jobs/jobs.module';
import { RoleGuard } from './common/guards/role.guard';
import { UserRepository } from './modules/users/domain/repositories/user.repository';
import { PrismaUserRepository } from './modules/users/infra/repositories/prisma-user.repository';
import { CoursesModule } from './modules/courses/courses.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    UserModule,
    AuthModule,
    CompaniesModule,
    JobsModule,
    CoursesModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
    {
      provide: UserRepository,
      useClass: PrismaUserRepository,
    },
  ],
})
export class AppModule {}
