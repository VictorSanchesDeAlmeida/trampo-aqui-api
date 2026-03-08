import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { CreateUserUseCase } from '../../application/use-cases/create-user.usecase';
import { UserMapper } from '../mappers/create-user.mapper';
import { Public } from 'src/common/decorator/is-public';
import { AppResponse } from 'src/common/response/app.response';

@Controller('users')
export class UserController {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  @Public()
  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    const newUser = UserMapper.toEntity(createUserDto);
    await this.createUserUseCase.execute(newUser);

    return new AppResponse({
      message: 'User created successfully',
      statusCode: 201,
      data: null,
    });
  }
}
