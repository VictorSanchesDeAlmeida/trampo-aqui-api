import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/modules/users/domain/repositories/user.repository';
import { JwtService } from '@nestjs/jwt';
import { AppError } from 'src/common/response/app.error';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class LoginUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(email: string, password: string) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new AppError({
        message: 'Invalid credentials',
        statusCode: 401,
      });
    }

    // Compara a senha fornecida com a senha hasheada armazenada
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new AppError({
        message: 'Invalid credentials',
        statusCode: 401,
      });
    }

    const sub = { sub: user.id, email: user.email, roleId: user.role };
    const token = await this.jwtService.signAsync(sub);
    return {
      user: {
        id: user.id,
        email: user.email,
        roleId: user.role,
      },
      token,
    };
  }
}
