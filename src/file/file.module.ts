import { Module } from '@nestjs/common';
import { FilesController } from './file.controller';
import { MinioService } from 'src/minio/minio.service';

@Module({
  controllers: [FilesController],
  providers: [MinioService],
})
export class FilesModule {}
