import { DeleteResult } from 'typeorm';
import { AuthorArgs } from './dto/args/author.args';
import { UpdateAuthorInput } from './dto/inputs/update.author.input';
import { JWTAuthGuard } from './../user/guards/jwt.guard';
import {
    AUTHOR_ALREADY_EXIST_ERROR,
    AUTHOR_NOT_FOUND_ERROR,
} from './errors/author.errors.constants';
import { CreateAuthorInput } from './dto/inputs/create.author.input';
import { AuthorEntity } from './author.entity';
import { AuthorService } from './author.service';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
    BadRequestException,
    UseGuards,
    NotFoundException,
} from '@nestjs/common';
import { RolesGuard } from 'src/user/guards/roles.guard';
import { Roles } from 'src/user/decorators/roles.decorator';
import { UserRole } from 'src/user/user.entity';

@UseGuards(JWTAuthGuard, RolesGuard)
@Resolver()
export class AuthorResolver {
    constructor(private readonly authorService: AuthorService) {}

    @Roles(UserRole.ADMIN, UserRole.MANAGER)
    @Mutation(() => AuthorEntity)
    async createAuthor(
        @Args('createAuthorData') { name }: CreateAuthorInput,
    ): Promise<AuthorEntity> {
        const author = await this.authorService.findAuthorByName({ name });

        if (author) {
            throw new BadRequestException(AUTHOR_ALREADY_EXIST_ERROR);
        }

        return await this.authorService.createAuthor({ name });
    }

    @Roles(UserRole.ADMIN, UserRole.MANAGER)
    @Mutation(() => AuthorEntity)
    async updateAuthor(
        @Args('updateAuthorData') { name }: UpdateAuthorInput,
        @Args() { id }: AuthorArgs,
    ): Promise<AuthorEntity> {
        const author = await this.authorService.findAuthorById({ id });

        if (!author) {
            throw new NotFoundException(AUTHOR_NOT_FOUND_ERROR);
        }

        return await this.authorService.updateAuthor({ id }, { name });
    }

    @Roles(UserRole.ADMIN, UserRole.MANAGER)
    @Mutation(() => AuthorEntity, { nullable: true })
    async deleteAuthor(@Args() { id }: AuthorArgs): Promise<DeleteResult> {
        return await this.authorService.deleteAuthor({ id });
    }

    @Roles(UserRole.ADMIN, UserRole.MANAGER)
    @Query(() => [AuthorEntity])
    async getAuthors(): Promise<AuthorEntity[]> {
        return await this.authorService.getAuthors();
    }

    @Roles(UserRole.ADMIN, UserRole.MANAGER)
    @Query(() => AuthorEntity)
    async getAuthor(@Args() { id }: AuthorArgs): Promise<AuthorEntity> {
        return await this.authorService.findAuthorById({ id });
    }
}
