export class BaseResponse<T> {
  private result: Result;
  private data: T;
  private message: string;
  private errorCode: string;

  private constructor(
    data: T,
    message: string,
    errorCode: string,
    result: Result,
  ) {
    this.data = data;
    this.message = message;
    this.errorCode = errorCode;
    this.result = result;
  }

  static success<T>(data: T, message: string = null) {
    return new BaseResponse(data, message, null, Result.SUCCESS);
  }

  static fail(message: string, errorCode: string) {
    return new BaseResponse(null, message, errorCode, Result.FAIL);
  }
}

enum Result {
  SUCCESS = 'SUCCESS',
  FAIL = 'FAIL',
}
