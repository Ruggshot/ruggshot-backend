import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType('ImageUploadType')
export class ImageUploadType {
  @Field()
  success: boolean;
}
