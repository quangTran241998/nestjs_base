import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Cat, CatSchema } from 'src/schemas/cats.schema';
import { AuthModule } from '../auth/auth.module';
import { ResponseCommonModule } from '../response-common/responseCommon.module';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';
import { PROVIDES_KEY } from 'src/constant/enum';

@Module({
  imports: [MongooseModule.forFeature([{ name: Cat.name, schema: CatSchema }]), AuthModule, ResponseCommonModule],
  controllers: [CatsController],
  providers: [
    CatsService,
    {
      provide: PROVIDES_KEY.TEST,
      useFactory: () => {
        return {
          appName: 'My App',
          version: '1.0.0',
        };
      },
    },
  ],
  exports: [PROVIDES_KEY.TEST],
})
export class CatsModule {}
//
