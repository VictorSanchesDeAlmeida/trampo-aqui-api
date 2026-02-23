import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AppError } from '../response/app.error';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: number;
    let message: string;

    if (exception instanceof AppError) {
      // Tratar erros customizados da aplicação
      status = exception.statusCode;
      message = exception.message;

      // Log mais limpo para erros de aplicação
      this.logger.warn(
        `📋 ${message} | ${request.method} ${request.url} | Status: ${status}`,
      );
    } else if (exception instanceof HttpException) {
      // Tratar erros HTTP do NestJS
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null &&
        'message' in exceptionResponse
      ) {
        message = String(exceptionResponse.message) || exception.message;
      } else {
        message = exception.message;
      }

      this.logger.warn(
        `🔴 ${message} | ${request.method} ${request.url} | Status: ${status}`,
      );
    } else {
      // Tratar erros não tratados
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Internal server error';

      // Log completo apenas para erros inesperados
      this.logger.error(
        `💥 Unexpected error | ${request.method} ${request.url}`,
        exception instanceof Error ? exception.stack : exception,
      );
    }

    // Resposta JSON padronizada
    const errorResponse = {
      statusCode: status,
      message,
    };

    response.status(status).json(errorResponse);
  }
}
