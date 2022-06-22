import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateEventInput {
  @Field(() => String)
  first_name: string;

  @Field(() => String)
  last_name: string;

  @Field(() => Int)
  zip_code: number;

  @Field(() => String)
  city: string;

  @Field(() => String)
  phone_number: string;

  // this ain't needed now that I have current user
  // @Field(() => Int)
  // userId: number;

  @Field(() => Int)
  categoryId: number;
}
