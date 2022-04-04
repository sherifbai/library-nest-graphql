import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateGenreInput {
    @Field()
    @IsString()
    @IsOptional()
    name?: string;
}
