import { InputType, Int, Field } from '@nestjs/graphql';
import { CreateOrganizationInput } from 'src/organization/dto/create-organization.input';

@InputType()
export class CreateCustomerInput {
  @Field(() => String)
  name: string;

  // IN THE FUTURE : Create child orgs of custome upon creation
  // @Field((type) => [CreateOrganizationInput], { nullable: true })
  // posts: [CreateOrganizationInput]
}
