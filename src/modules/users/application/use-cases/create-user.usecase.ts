import { AppError } from 'src/common/response/app.error';
import { User } from '../../domain/entities/user.entity';
import { UserRepository } from '../../domain/repositories/user.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CreateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(user: User): Promise<void> {
    try {
      // Verifica se o usuário já existe
      const existingUser = await this.userRepository.findByEmail(user.email);
      if (existingUser) {
        throw new AppError({
          message: 'Email already in use',
          statusCode: 400,
        });
      }

      // Cria o usuário
      await this.userRepository.create(user);
    } catch (error) {
      // Re-throw AppError sem modificar
      if (error instanceof AppError) {
        throw error;
      }

      // Tratar erros de validação da entidade
      if (error instanceof Error) {
        throw new AppError({
          message: error.message,
          statusCode: 400,
        });
      }

      // Erro genérico de banco de dados ou sistema
      throw new AppError({
        message: 'Failed to create user',
        statusCode: 500,
      });
    }
  }
}
