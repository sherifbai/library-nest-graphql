import { IsNotEmpty, IsNumber } from 'class-validator';
import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class BookArgs {
    @Field()
    @IsNumber()
    @IsNotEmpty()
    id: number;
}
