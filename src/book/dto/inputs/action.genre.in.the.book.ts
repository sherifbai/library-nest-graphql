import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class ActionGenreInTheBook {
    @Field(() => [Number])
    genres: number[];
}
