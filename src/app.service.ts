import { Injectable } from '@nestjs/common';
import { ResponseHelper } from './modules/response-common/responseCommon.service';

@Injectable()
export class AppService {
  constructor(private readonly responseHelper: ResponseHelper) {}
  getHello() {
    return this.responseHelper.success('123');
  }
}
