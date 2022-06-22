import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserNumber {
  @Field(() => Int, { nullable: true })
  id: number;

  @Field(() => String, { nullable: true })
  name: string;

  @Field(() => String, { nullable: true })
  phone_number: string;
}
