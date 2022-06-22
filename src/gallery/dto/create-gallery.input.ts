import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateGalleryInput {
  @Field(() => Boolean)
  active: boolean;
}
