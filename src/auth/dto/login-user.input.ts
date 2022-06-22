import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class LoginUserInput {
  @Field(() => String)
  phone_number: string;

  @Field(() => String)
  password: string;
}
