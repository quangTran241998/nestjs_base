//@ts-nocheck

import { Injectable } from '@nestjs/common';
import { Client } from 'minio';
import * as crypto from 'crypto';

@Injectable()
export class MinioService {
  private readonly minioClient: Client;

  constructor() {
    this.minioClient = new Client({
      endPoint: process.env.MINIO_ENDPOINT,
      // port: parseInt(process.env.MINIO_PORT),
      useSSL: process.env.MINIO_USE_SSL === 'true',
      accessKey: process.env.MINIO_ACCESS_KEY,
      secretKey: process.env.MINIO_SECRET_KEY,
    });
  }

  async uploadFile(bucketName: string, file: any) {
    const fileName = crypto.randomBytes(16).toString('hex') + file.originalname;

    const res = await this.minioClient.putObject(
      bucketName,
      fileName,
      file.buffer,
      //   metaData,
    );

    const fileUrl = `https://${process.env.MINIO_ENDPOINT}/${process.env.MINIO_BUCKET_NAME}/${fileName}`;

    return fileUrl;
  }

  async getFile(bucketName: string, objectName: string) {
    return new Promise((resolve, reject) => {
      this.minioClient.getObject(bucketName, objectName, (err, dataStream) => {
        if (err) {
          return reject(err);
        }
        const chunks = [];
        dataStream.on('data', (chunk) => {
          chunks.push(chunk);
        });
        dataStream.on('end', () => {
          resolve(Buffer.concat(chunks));
        });
        dataStream.on('error', (error) => {
          reject(error);
        });
      });
    });
  }
}
