import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { config } from 'process';
import * as AWS from 'aws-sdk';

@Injectable()
export class S3Service {
  constructor(@Inject(ConfigService) private cfg: ConfigService) {}

  AWS_S3_BUCKET = this.cfg.get('AWS_S3_BUCKET');
  s3 = new AWS.S3();

  // monkey = this.s3.upload();

  async uploadFile(file) {
    const { originalName } = file;

    await this.s3_upload(
      file.buffer,
      this.AWS_S3_BUCKET,
      originalName,
      file.mimetype,
    );
  }

  async s3_upload(file, bucket, name, mimetype) {
    const params = {
      Bucket: bucket,
      Key: String(name),
      Body: file,
      ContentType: mimetype,
      ContentDispositon: 'inline',
      CreateBucketConfiguration: {
        LocationConstraint: 'eu-central-1',
      },
    };
    console.log(params);

    try {
      let response = await this.s3.upload(params).promise();

      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }
}
