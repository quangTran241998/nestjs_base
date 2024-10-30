import { HttpStatus } from '@nestjs/common';
import { ResponseCommon } from 'src/interfaces/common';

export class ResponseHelper {
  static success<T>(data: T, message = 'success'): ResponseCommon<T> {
    return {
      statusCode: HttpStatus.OK,
      errorCode: 1,
      message,
      data,
    };
  }

  static error(message = 'error', statusCode = HttpStatus.BAD_REQUEST): ResponseCommon<null> {
    return {
      statusCode,
      errorCode: 0,
      message,
      data: null,
    };
  }
}
