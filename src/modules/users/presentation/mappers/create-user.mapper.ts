import { randomUUID } from 'crypto';
import { User } from '../../domain/entities/user.entity';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UserResponseDto } from '../dtos/user-response.dto';

export class UserMapper {
  static toEntity(dto: CreateUserDto) {
    const user = new User(
      randomUUID(),
      dto.name,
      dto.email,
      dto.document,
      new Date(dto.birthDate),
      dto.password,
      dto.roleId,
      new Date(),
    );
    user.setPassword(dto.password);

    return user;
  }

  static toResponse(user: User) {
    return new UserResponseDto(user.id, user.name, user.email, user.createdAt);
  }
}
