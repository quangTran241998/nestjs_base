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
import { ResponseHelperI18n } from './services/responseI18n.service';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URI ?? 'mongodb://localhost:27017/test'),
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
