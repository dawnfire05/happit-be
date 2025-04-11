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
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body, query, params, headers } = request;
    const userAgent = headers['user-agent'] || '';
    const ip = request.ip || request.connection.remoteAddress;

    this.logger.log(
      `[${method}] ${url} - IP: ${ip} - User-Agent: ${userAgent}`,
    );
    this.logger.log('Request Body:', JSON.stringify(body));
    this.logger.log('Query Parameters:', JSON.stringify(query));
    this.logger.log('Route Parameters:', JSON.stringify(params));

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
          this.logger.log('Response Data:', JSON.stringify(data));
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
