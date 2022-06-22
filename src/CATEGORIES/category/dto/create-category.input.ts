import { InputType, Int, Field } from '@nestjs/graphql';
import { IsLowercase } from 'class-validator';

@InputType()
export class CreateCategoryInput {
  //@IsLowercase()
  @Field(() => String)
  category_name: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => String, { nullable: true })
  image?: string;
}
