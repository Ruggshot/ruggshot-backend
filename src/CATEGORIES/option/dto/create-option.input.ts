import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateOptionInput {
  @Field(() => String)
  option_name: string;

  @Field(() => Int)
  parent_feat_id: number;
}
