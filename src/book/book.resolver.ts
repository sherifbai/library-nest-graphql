import { JWTAuthGuard } from './../user/guards/jwt.guard';
import { BOOK_NOT_FOUND_ERROR } from './errors/book.error.constants';
import { NotFoundException, UseGuards } from '@nestjs/common';
import { UpdateBookInput } from './dto/inputs/update.book.input';
import { BookArgs } from './dto/args/book.args';
import { CreateBookInput } from './dto/inputs/create.book.input';
import { BookEntity } from './book.entity';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BookService } from './book.service';
import { RolesGuard } from 'src/user/guards/roles.guard';
import { Roles } from 'src/user/decorators/roles.decorator';
import { UserRole } from 'src/user/user.entity';

@Resolver()
export class BookResolver {
    constructor(private readonly bookService: BookService) {}

    @UseGuards(JWTAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.MANAGER)
    @Mutation(() => BookEntity)
    async createBook(@Args('createBookData') createBookData: CreateBookInput) {
        return await this.bookService.createBook(createBookData);
    }

    @UseGuards(JWTAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.MANAGER)
    @Mutation(() => BookEntity)
    async updateBook(
        @Args('updateBookData') { name, authors, genres }: UpdateBookInput,
        @Args() { id }: BookArgs,
    ): Promise<BookEntity> {
        const book = await this.bookService.getBookById({ id });

        if (!book) {
            throw new NotFoundException(BOOK_NOT_FOUND_ERROR);
        }

        return await this.bookService.updateBook(
            { id },
            { name, authors, genres },
        );
    }

    @UseGuards(JWTAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.MANAGER)
    @Mutation(() => BookEntity)
    async deleteBook(@Args() { id }: BookArgs) {
        const book = await this.bookService.getBookById({ id });

        if (!book) {
            throw new NotFoundException();
        }

        return await this.bookService.deleteBook({ id });
    }

    @Query(() => [BookEntity])
    async getBooks(): Promise<BookEntity[]> {
        return await this.bookService.getBooks();
    }

    @Query(() => BookEntity)
    async getBook(@Args() { id }: BookArgs) {
        return await this.bookService.getBookById({ id });
    }
}