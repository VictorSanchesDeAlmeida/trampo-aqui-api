import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../enums/user-role.enum';
import { ROLES_KEY } from '../decorator/roles.decorator';
import { IS_PUBLIC_KEY } from '../decorator/is-public';
import { AppError } from '../response/app.error';
import { UserRepository } from 'src/modules/users/domain/repositories/user.repository';
import { User } from 'src/modules/users/domain/entities/user.entity';

interface AuthenticatedRequest extends Request {
  user?: {
    sub: string;
    role?: UserRole;
    fullUser?: User;
  };
}

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private userRepository: UserRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Verificar se o endpoint é público
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    // Obter os roles necessários para acessar o endpoint
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    console.log(requiredRoles);

    // Se não há roles específicos definidos, permitir acesso (já passou pelo AuthGuard)
    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request.user;

    if (!user || !user.sub) {
      throw new AppError({
        statusCode: 401,
        message: 'User not authenticated',
      });
    }

    try {
      // Buscar as informações completas do usuário, incluindo o role
      const fullUser = await this.userRepository.findById(user.sub);

      if (!fullUser) {
        throw new AppError({
          statusCode: 401,
          message: 'User not found',
        });
      }

      // Verificar se o usuário tem pelo menos um dos roles necessários
      const userRole = fullUser.role as UserRole;
      const hasPermission = requiredRoles.includes(userRole);

      if (!hasPermission) {
        throw new AppError({
          statusCode: 403,
          message: 'Insufficient permissions',
        });
      }

      // Anexar informações do usuário ao request para uso posterior
      if (request.user) {
        request.user.role = userRole;
        request.user.fullUser = fullUser;
      }

      return true;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      throw new AppError({
        statusCode: 500,
        message: 'Error checking user permissions',
      });
    }
  }
}
