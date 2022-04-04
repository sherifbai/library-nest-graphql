import { Field, InputType } from '@nestjs/graphql';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateBookInput {
    @Field()
    @IsString()
    @IsNotEmpty()
    name: string;

    @Field(() => [Number])
    @IsArray({ each: true })
    @IsNotEmpty()
    genres: number[];

    @Field(() => [Number])
    @IsArray({ each: true })
    @IsNotEmpty()
    authors: number[];
}
