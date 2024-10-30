import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Cat, CatSchema } from 'src/schemas/cats.schema';
import { AuthModule } from '../auth/auth.module';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Cat.name, schema: CatSchema }]), AuthModule],
  controllers: [CatsController],
  providers: [CatsService],
})
export class CatsModule {}
//
