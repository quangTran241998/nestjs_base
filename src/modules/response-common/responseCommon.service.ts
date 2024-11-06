import { Injectable, HttpStatus } from '@nestjs/common';
import { ResponseCommon } from 'src/interfaces/common';
import { I18nService, I18nContext } from 'nestjs-i18n';

@Injectable()
export class ResponseHelper {
  constructor(private readonly i18n: I18nService) {}

  async success<T>(
    data: T,
    messageKey = 'test.response.success', // Khóa mặc định trong file dịch
    lang: string = I18nContext.current().lang,
  ): Promise<ResponseCommon<T>> {
    const message = await this.i18n.translate(messageKey, { lang });
    return {
      statusCode: HttpStatus.OK,
      message,
      data,
    };
  }

  async error(
    messageKey = 'test.response.error',
    statusCode = HttpStatus.BAD_REQUEST,
    lang: string = I18nContext.current().lang,
  ): Promise<ResponseCommon<null>> {
    const message = await this.i18n.translate(messageKey, { lang });
    return {
      statusCode,
      message,
      data: null,
    };
  }
}
