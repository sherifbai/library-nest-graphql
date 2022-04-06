import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class ActionAuthorInTheBook {
    @Field(() => [Number])
    authors: number[];
}
