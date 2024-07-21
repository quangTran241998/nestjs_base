import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FilesModule } from './file/file.module';
import { ArticleModule } from './modules/article/article.module';
import { AuthModule } from './modules/auth/auth.module';
import { BannerHomeModule } from './modules/banner-home/bannerHome.module';
import { CatsModule } from './modules/cats/cats.module';
import { UsersModule } from './modules/user/user.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.MONGODB_URI ?? 'mongodb://localhost:27017/test',
    ),
    CatsModule,
    BannerHomeModule,
    ArticleModule,
    FilesModule,
    UsersModule,
    AuthModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
