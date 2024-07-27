export class ResponseData {
  statusCode: number;
  message: string;
  result: {
    data: {} | [];
    total?: number;
  };

  constructor(
    data: {} | [],
    statusCode: number,
    message: string,
    total?: number,
  ) {
    this.statusCode = statusCode;
    this.message = message;
    this.result = {
      data: data,
      total: total,
    };

    return this;
  }
}
