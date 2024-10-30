export interface ResponseCommon<T> {
  statusCode: number;
  errorCode: 0 | 1;
  message: string;
  data: T;
}

export interface ResponseDataListCommon<T> {
  data: T;
  page: number;
  size: number;
  total: number;
}

export enum STATUS {
  SUCCESS = 1,
  ERROR = 0,
}
