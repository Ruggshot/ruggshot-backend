import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateUserInput {
  @Field(() => String)
  name: string;

  @Field(() => String)
  phone_number: string;

  @Field(() => String, { nullable: true })
  password?: string;

  @Field(() => Int, { nullable: true })
  activeOrganization?: number;
}
