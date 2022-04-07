import { ActionGenreInTheBook } from './dto/inputs/action.genre.in.the.book';
import { JWTAuthGuard } from './../user/guards/jwt.guard';
import { BOOK_NOT_FOUND_ERROR } from './errors/book.error.constants';
import { NotFoundException, UseGuards } from '@nestjs/common';
import { UpdateBookInput } from './dto/inputs/update.book.input';
import { BookArgs } from './dto/args/book.args';
import { CreateBookInput } from './dto/inputs/create.book.input';
import { BookEntity } from './book.entity';
import { Args, Info, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BookService } from './book.service';
import { RolesGuard } from 'src/user/guards/roles.guard';
import { Roles } from 'src/user/decorators/roles.decorator';
import { UserRole } from 'src/user/user.entity';
import { ActionAuthorInTheBook } from './dto/inputs/action.author.in.the.book';

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
    async addAuthorToTheBook(
        @Args() { id }: BookArgs,
        @Args('authorsData') { authors }: ActionAuthorInTheBook,
    ): Promise<BookEntity> {
        const book = await this.bookService.getBookById({ id });

        if (!book) {
            throw new NotFoundException(BOOK_NOT_FOUND_ERROR);
        }

        return await this.bookService.addAuthorToTheBook({ id }, { authors });
    }

    @UseGuards(JWTAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.MANAGER)
    @Mutation(() => BookEntity)
    async addGenreToTheBook(
        @Args() { id }: BookArgs,
        @Args('genresData') { genres }: ActionGenreInTheBook,
    ): Promise<BookEntity> {
        const book = await this.bookService.getBookById({ id });

        if (!book) {
            throw new NotFoundException(BOOK_NOT_FOUND_ERROR);
        }

        return await this.bookService.addGenreToTheBook({ id }, { genres });
    }

    @UseGuards(JWTAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.MANAGER)
    @Mutation(() => BookEntity)
    async deleteAuthorFromTheBook(
        @Args() { id }: BookArgs,
        @Args('authorsData') { authors }: ActionAuthorInTheBook,
    ): Promise<BookEntity> {
        const book = await this.bookService.getBookById({ id });

        if (!book) {
            throw new NotFoundException(BOOK_NOT_FOUND_ERROR);
        }

        return await this.bookService.deleteAuthorFromTheBook(
            { id },
            { authors },
        );
    }

    @UseGuards(JWTAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.MANAGER)
    @Mutation(() => BookEntity)
    async deleteGenreFromTheBook(
        @Args() { id }: BookArgs,
        @Args('genresData') { genres }: ActionGenreInTheBook,
    ): Promise<BookEntity> {
        const book = await this.bookService.getBookById({ id });

        if (!book) {
            throw new NotFoundException(BOOK_NOT_FOUND_ERROR);
        }

        return await this.bookService.deleteGenreFromTheBook(
            { id },
            { genres },
        );
    }

    @UseGuards(JWTAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.MANAGER)
    @Mutation(() => BookEntity, { nullable: true })
    async deleteBook(@Args() { id }: BookArgs): Promise<BookEntity> {
        const book = await this.bookService.getBookById({ id });

        if (!book) {
            throw new NotFoundException(BOOK_NOT_FOUND_ERROR);
        }

        await this.bookService.deleteBook({ id });

        return book;
    }

    @Query(() => [BookEntity])
    async getBooks(@Info() info: any): Promise<BookEntity[]> {
        const query = info.fieldNodes[0].selectionSet.selections.map(item => item.name.value);
        return await this.bookService.getBooks(query);
    }

    @Query(() => BookEntity)
    async getBook(@Args() { id }: BookArgs) {
        return await this.bookService.getBookById({ id });
    }
}
