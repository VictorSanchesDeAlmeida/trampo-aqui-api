import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/modules/users/domain/repositories/user.repository';
import { JwtService } from '@nestjs/jwt';
import { AppError } from 'src/common/response/app.error';

@Injectable()
export class LoginUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(email: string, password: string): Promise<string> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new AppError({
        message: 'Invalid credentials',
        statusCode: 401,
      });
    }

    // Here you would typically compare the provided password with the stored hashed password
    // For simplicity, we are just checking if they match directly
    if (user.password !== password) {
      throw new AppError({
        message: 'Invalid credentials',
        statusCode: 401,
      });
    }

    const sub = { userId: user.id };
    const token = await this.jwtService.signAsync(sub);
    return token;
  }
}
