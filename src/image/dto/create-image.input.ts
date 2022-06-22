import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateImageInput {
  @Field(() => Int)
  beafId: number;

  @Field(() => Int)
  spotInLine: number;

  @Field(() => Int)
  eventId: number;
}
