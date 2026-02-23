import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { CreateUserUseCase } from '../../application/use-cases/create-user.usecase';
import { UserMapper } from '../mappers/create-user.mapper';
import { Public } from 'src/common/decorator/is-public';

@Controller('users')
export class UserController {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  @Public()
  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    const newUser = UserMapper.toEntity(createUserDto);
    await this.createUserUseCase.execute(newUser);

    return {
      message: 'User created successfully',
      statusCode: 201,
    };
  }
}
