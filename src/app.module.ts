import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from './modules/products/products.module';
import { CatsModule } from './modules/cats/cats.module';
import { jwtConstants } from './constant/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot(
      'uw5oa3XrF2ZmyvQx@cluster0.brul8of.mongodb.net/cats',
    ),
    ProductModule,
    CatsModule,
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
