import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Admin {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  name: string;

  @Field(() => String)
  email: string;

  @Field(() => String, { nullable: true })
  phone_number: string;

  @Field(() => String)
  password: string;

  @Field(() => Date)
  createdAt: Date;
}
