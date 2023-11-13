import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { BaseResponse } from '../../base/response/base-response';
import { TypeORMError } from 'typeorm';
import { get } from 'lodash';

@Catch()
export class AllCatchExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly logger: Logger,
  ) {}

  catch(exception: unknown, host: ArgumentsHost): any {
    const httpArgumentsHost = host.switchToHttp();
    const { httpAdapter } = this.httpAdapterHost;
    const [exceptionResponse, typeName] = this.errorInfo(exception);

    this.logger.error(
      `[${typeName}]: ${
        get(
          exceptionResponse,
          'originException.message',
          'originException.errmsg',
        ) || 'Interval Server Error'
      }`,
      {
        stack: exception['stack'],
      },
    );

    httpAdapter.reply(
      httpArgumentsHost.getResponse(),
      BaseResponse.fail(
        exceptionResponse['message'],
        exceptionResponse['errorCode'],
      ),
    );
  }

  private errorInfo(exception: unknown) {
    switch (exception) {
      case exception instanceof HttpException:
        const httpException = exception as unknown as HttpException;
        const httpErrorResponse = httpException.getResponse();
        return [
          {
            message: 'Http Error',
            errorCode: get(httpErrorResponse, 'errorCode'),
            originException: httpErrorResponse,
          },
          HttpException.name,
        ];
      case exception instanceof TypeORMError:
        return [
          {
            message: 'SQL Error',
            errorCode: HttpStatus.INTERNAL_SERVER_ERROR + '',
            originException: exception as unknown as TypeORMError,
          },
          TypeORMError.name,
        ];
      case exception instanceof Error:
        return [exception as unknown as Error, Error.name];
      default:
        return [
          {
            message: 'Interval Server Error',
            errorCode: HttpStatus.INTERNAL_SERVER_ERROR + '',
          },
          'Unchecked Error',
        ];
    }
  }
}
