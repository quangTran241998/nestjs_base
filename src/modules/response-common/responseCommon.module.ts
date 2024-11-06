import { Module } from '@nestjs/common';
import { ResponseHelper } from './responseCommon.service';

@Module({
  providers: [ResponseHelper],
  exports: [ResponseHelper], // Export để các module khác có thể sử dụng
})
export class ResponseCommonModule {}
