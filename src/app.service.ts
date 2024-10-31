import { Injectable } from '@nestjs/common';
import { ResponseHelperI18n } from './services/responseI18n.service';

@Injectable()
export class AppService {
  constructor(private readonly responseHelperI18n: ResponseHelperI18n) {}
  getHello() {
    return this.responseHelperI18n.success('123');
  }
}
