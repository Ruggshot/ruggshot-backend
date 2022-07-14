import { Field, InputType, Int } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';
import { Feature } from 'src/CATEGORIES/feature/entities/feature.entity';
import { Option } from 'src/CATEGORIES/option/entities/option.entity';

@InputType()
export class BeafUpdateInputDto {
  @Field(() => Int, { nullable: true })
  featureId?: number;

  @Field(() => [Int], { nullable: true })
  options?: [number];

  @Field(() => String, { nullable: true })
  description?: string;
}

// @InputType()
//  export class BeafUpdateInputDto implements Prisma.BeafUncheckedUpdateInput {
//   @Field(() => Int, { nullable: true })
//   featureId?: number | Prisma.NullableIntFieldUpdateOperationsInput;

//   @Field(() => [Int])
//   options?: Prisma.OptionUpdateManyWithoutBeafsInput;

//   @Field(() => [Int])
//   id?: number | Prisma.IntFieldUpdateOperationsInput;
// }
