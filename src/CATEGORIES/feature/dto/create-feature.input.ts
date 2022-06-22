import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateFeatureInput {
  @Field(() => String)
  feature_name: string;

  @Field(() => Int)
  parent_cat_id: number;
}
