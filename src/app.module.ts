import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AcceptLanguageResolver, I18nJsonLoader, I18nModule } from 'nestjs-i18n';
import * as path from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { ArticleModule } from './modules/article/article.module';
import { AuthModule } from './modules/auth/auth.module';
import { CatsModule } from './modules/cats/cats.module';
import { ProfileModule } from './modules/user/profile/profile.module';
import { UsersModule } from './modules/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { ResponseCommonModule } from './modules/response-common/responseCommon.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    I18nModule.forRoot({
      fallbackLanguage: 'vi',
      loaderOptions: {
        path: path.join(__dirname, '../src/i18n/'),
        watch: true,
      },
      loader: I18nJsonLoader,
      resolvers: [{ use: AcceptLanguageResolver, options: { matchType: 'strict' } }],
    }),
    CatsModule,
    ArticleModule,
    AuthModule,
    ProfileModule,
    UsersModule,
    ResponseCommonModule,
  ],

  controllers: [AppController],
  providers: [AppService],
  exports: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware) // Sử dụng LoggerMiddleware
      .forRoutes('*'); // Áp dụng cho tất cả các routes, có thể tùy chỉnh cho route cụ thể
  }
}
