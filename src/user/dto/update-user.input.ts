import { CreateUserInput } from './create-user.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {
  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String)
  password?: string;

  @Field(() => Int, { nullable: true })
  activeOrganization?: number;
}
