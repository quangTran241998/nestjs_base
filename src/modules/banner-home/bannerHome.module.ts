import { BannerHomeSchema } from './../../schemas/banner-home.schema';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CatsController } from './bannerHome.controller';
import { BannerHomeService } from './bannerHome.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Banner home', schema: BannerHomeSchema },
    ]),
  ],
  controllers: [CatsController],
  providers: [BannerHomeService],
})
export class BannerHomeModule {}
