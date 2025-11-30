
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    // Check if the context is RPC (microservice) or HTTP
    if (host.getType() === 'rpc') {
      // For microservices, throw an RpcException
      // If it's already an RpcException, just rethrow
      if (exception instanceof RpcException) {
        throw exception;
      }
      // If it's a Nest HttpException, extract message
      if (exception instanceof HttpException) {
        const errorResponse = exception.getResponse();
        const message = (errorResponse as any)?.message || errorResponse || 'Internal Server Error';
        throw new RpcException(message);
      }
      // Otherwise, wrap in RpcException
      throw new RpcException(exception?.message || 'Internal Server Error');
    } else {
      // HTTP context (REST)
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      const request = ctx.getRequest<Request>();
      const status =
        exception instanceof HttpException
          ? exception.getStatus()
          : HttpStatus.INTERNAL_SERVER_ERROR;
      const errorResponse = exception instanceof HttpException ? exception.getResponse() : null;
      const responseBody = {
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request?.url,
        message: (errorResponse as any)?.message || errorResponse || exception?.message || 'Internal Server Error',
        error: (errorResponse as any)?.error || exception?.message,
      };
      response.status(status).json(responseBody);
    }
  }
}