import { Body, Controller, Post } from '@nestjs/common';
import { LoginUseCase } from '../../application/use-cases/login.usecase';
import { LoginDto } from '../dtos/login.dto';
import { Public } from 'src/common/decorator/is-public';
import { AppResponse } from 'src/common/response/app.response';

@Controller('auth')
export class AuthController {
  constructor(private readonly loginUseCase: LoginUseCase) {}

  @Public()
  @Post('login')
  async login(@Body() data: LoginDto) {
    const { email, password } = data;
    const result = await this.loginUseCase.execute(email, password);
    return new AppResponse({
      message: 'Login successful',
      statusCode: 200,
      data: result,
    });
  }
}
