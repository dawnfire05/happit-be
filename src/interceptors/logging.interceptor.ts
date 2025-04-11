import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body, query, params, headers } = request;
    const userAgent = headers['user-agent'] || '';
    const ip = request.ip || request.connection.remoteAddress;

    this.logger.log(
      `[${method}] ${url} - IP: ${ip} - User-Agent: ${userAgent}`,
    );
    this.logger.debug('Request Body:', body);
    this.logger.debug('Query Parameters:', query);
    this.logger.debug('Route Parameters:', params);

    const now = Date.now();
    return next.handle().pipe(
      tap({
        next: (data) => {
          const response = context.switchToHttp().getResponse();
          const { statusCode } = response;
          const responseTime = Date.now() - now;

          this.logger.log(
            `[${method}] ${url} - Status: ${statusCode} - ${responseTime}ms`,
          );
          this.logger.debug('Response Data:', data);
        },
        error: (error) => {
          const responseTime = Date.now() - now;
          this.logger.error(
            `[${method}] ${url} - Error: ${error.message} - ${responseTime}ms`,
          );
          this.logger.error('Error Stack:', error.stack);
        },
      }),
    );
  }
}
