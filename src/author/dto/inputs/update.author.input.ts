import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';

@InputType()
export class UpdateAuthorInput {
    @Field()
    @IsOptional()
    @IsString()
    name?: string;
}
