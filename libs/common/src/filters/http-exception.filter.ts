import { 
  ExceptionFilter, 
  Catch, 
  ArgumentsHost, 
  HttpException, 
  HttpStatus 
} from '@nestjs/common';
import { Request, Response } from 'express'; // Use your underlying framework types

@Catch(HttpException)
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    
    // Determine the status code of the error
    const status = 
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // Get the response object from the HttpException (can be a string or an object)
    const errorResponse = exception.getResponse();
    
    // Standardize the response body structure
    const responseBody = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      // Check if the response is a standard NestJS error object or a string
      message: (errorResponse as any)?.message || errorResponse || 'Internal Server Error',
      error: (errorResponse as any)?.error || exception.message,
    };

    // Log the error (optional but recommended for debugging)
    // console.error(`[${request.method}] ${request.url} failed with status ${status}:`, exception.stack);

    // Send the standardized JSON response
    response
      .status(status)
      .json(responseBody);
  }
}