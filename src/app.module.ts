import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatsModule } from './modules/cats/cats.module';
import { jwtConstants } from './constant/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { BannerHomeModule } from './modules/banner-home/bannerHome.module';
import { FilesModule } from './file/file.module';
import { ArticleModule } from './modules/article/article.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.MONGODB_URI ?? 'mongodb://localhost:27017/test',
    ),
    CatsModule,
    BannerHomeModule,
    ArticleModule,
    FilesModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: 900000 },
    }),
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
