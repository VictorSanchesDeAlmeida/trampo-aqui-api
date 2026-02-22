import { Body, Controller, Post } from '@nestjs/common';
import { LoginUseCase } from '../../application/use-cases/login.usecase';
import { LoginDto } from '../dtos/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly loginUseCase: LoginUseCase) {}

  @Post()
  async login(@Body() data: LoginDto) {
    const { email, password } = data;
    const token = await this.loginUseCase.execute(email, password);
    return { token };
  }
}
