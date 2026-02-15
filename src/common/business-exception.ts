import { HttpException } from '@nestjs/common';

export class BusinessException extends HttpException {
  constructor(errorCode: string, statusCode: number, message?: string) {
    super({ errorCode, message: message ?? errorCode }, statusCode);
  }
}
