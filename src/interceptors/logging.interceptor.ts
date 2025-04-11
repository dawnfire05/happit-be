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

    console.log(`[${method}] ${url} - IP: ${ip} - User-Agent: ${userAgent}`);
    console.log('Request Body:', body);
    console.log('Query Parameters:', query);
    console.log('Route Parameters:', params);

    const now = Date.now();
    return next.handle().pipe(
      tap({
        next: (data) => {
          const response = context.switchToHttp().getResponse();
          const { statusCode } = response;
          const responseTime = Date.now() - now;

          console.log(
            `[${method}] ${url} - Status: ${statusCode} - ${responseTime}ms`,
          );
          console.log('Response Data:', data);
        },
        error: (error) => {
          const responseTime = Date.now() - now;
          console.error(
            `[${method}] ${url} - Error: ${error.message} - ${responseTime}ms`,
          );
          console.error('Error Stack:', error.stack);
        },
      }),
    );
  }
}
