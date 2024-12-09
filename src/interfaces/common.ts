export interface ResponseCommon<T> {
  statusCode: number;
  message: string | unknown;
  data: T;
}

export interface ResponseDataListCommon<T> {
  data: T;
  page: number;
  size: number;
  total: number;
}

export interface PaginationResponse {
  page: number;
  size: number;
  total: number;
}

export enum STATUS {
  SUCCESS = 1,
  ERROR = 0,
}
