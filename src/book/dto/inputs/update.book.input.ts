import { Field, InputType } from '@nestjs/graphql';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

@InputType()
export class UpdateBookInput {
    @Field()
    @IsString()
    @IsOptional()
    name?: string;

    @Field(() => [Number])
    @IsOptional()
    @IsNumber()
    @IsArray({ each: true })
    genres?: number[];

    @Field(() => [Number])
    @IsOptional()
    @IsNumber()
    @IsArray({ each: true })
    authors?: number[];
}
