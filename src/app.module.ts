import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArticleModule } from './modules/article/article.module';
import { AuthModule } from './modules/auth/auth.module';
import { CatsModule } from './modules/cats/cats.module';
import { ProfileModule } from './modules/user/profile/profile.module';
import { UsersModule } from './modules/user/user.module';
import { I18nModule, I18nJsonLoader, QueryResolver, HeaderResolver, CookieResolver } from 'nestjs-i18n';
import * as path from 'path';
import { ResponseHelperI18n } from './services/responseI18n.service';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { AcceptLanguageResolver } from 'nestjs-i18n';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URI ?? 'mongodb://localhost:27017/test'),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
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
  ],

  controllers: [AppController],
  providers: [AppService, ResponseHelperI18n],
  exports: [ResponseHelperI18n],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware) // Sử dụng LoggerMiddleware
      .forRoutes('*'); // Áp dụng cho tất cả các routes, có thể tùy chỉnh cho route cụ thể
  }
}
