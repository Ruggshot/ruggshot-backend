import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateStoryInput {
  @Field(() => String)
  story_description: string;
}
