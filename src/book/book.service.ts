import { ActionGenreInTheBook } from './dto/inputs/action.genre.in.the.book';
import { UpdateBookInput } from './dto/inputs/update.book.input';
import { GenreEntity } from './../genre/genre.entity';
import { AuthorEntity } from './../author/author.entity';
import { CreateBookInput } from './dto/inputs/create.book.input';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';
import { BookEntity } from './book.entity';
import { BookArgs } from './dto/args/book.args';
import { ActionAuthorInTheBook } from './dto/inputs/action.author.in.the.book';

@Injectable()
export class BookService {
    constructor(
        @InjectRepository(BookEntity)
        private readonly bookRepo: Repository<BookEntity>,
        @InjectRepository(AuthorEntity)
        private readonly authorRepo: Repository<AuthorEntity>,
        @InjectRepository(GenreEntity)
        private readonly genreRepo: Repository<GenreEntity>,
    ) {}

    async createBook({
        name,
        authors,
        genres,
    }: CreateBookInput): Promise<BookEntity> {
        const genres_list = await this.genreRepo.findByIds(genres);
        const authors_list = await this.authorRepo.findByIds(authors);
        const book = this.bookRepo.create({
            name: name.toLowerCase().trim(),
            authors: authors_list,
            genres: genres_list,
        });

        return await this.bookRepo.save(book);
    }

    async updateBook(
        { id }: BookArgs,
        { name, genres, authors }: UpdateBookInput,
    ): Promise<BookEntity> {
        const genres_list = await this.genreRepo.findByIds(genres);
        const authors_list = await this.authorRepo.findByIds(authors);

        const book = await this.bookRepo.findOne({
            where: { id },
            relations: ['genres', 'authors'],
        });

        book.name = name.toLowerCase().trim();
        book.authors = Array.from(new Set(book.authors.concat(authors_list)));
        book.genres = Array.from(new Set(book.genres.concat(genres_list)));

        return await this.bookRepo.save(book);
    }

    async addAuthorToTheBook(
        { id }: BookArgs,
        { authors }: ActionAuthorInTheBook,
    ): Promise<BookEntity> {
        const authors_list = await this.authorRepo.findByIds(authors);

        const book = await this.bookRepo.findOne({
            where: { id },
            relations: ['genres', 'authors'],
        });

        book.authors = Array.from(new Set(book.authors.concat(authors_list)));

        return await this.bookRepo.save(book);
    }

    async addGenreToTheBook(
        { id }: BookArgs,
        { genres }: ActionGenreInTheBook,
    ): Promise<BookEntity> {
        const genres_list = await this.genreRepo.findByIds(genres);;

        const book = await this.bookRepo.findOne({
            where: { id },
            relations: ['genres', 'authors'],
        });

        book.genres = Array.from(new Set(book.genres.concat(genres_list)));

        return await this.bookRepo.save(book);
    }

    async deleteAuthorFromTheBook(
        { id }: BookArgs,
        { authors }: ActionAuthorInTheBook,
    ): Promise<BookEntity> {
        const book = await this.bookRepo.findOne({
            where: { id },
            relations: ['genres', 'authors'],
        });
        book.authors = book.authors.filter((el) => {
            return !authors.some((author) => author === el.id);
        });

        return await this.bookRepo.save(book);
    }

    async deleteGenreFromTheBook(
        { id }: BookArgs,
        { genres }: ActionGenreInTheBook,
    ): Promise<BookEntity> {
        const book = await this.bookRepo.findOne({
            where: { id },
            relations: ['genres', 'authors'],
        });
        book.genres = book.genres.filter((el) => {
            return !genres.some((genre) => genre === el.id);
        });

        return await this.bookRepo.save(book);
    }

    async deleteBook({ id }: BookArgs): Promise<DeleteResult> {
        return await this.bookRepo.delete(id);
    }

    async getBookById({ id }: BookArgs) {
        return await this.bookRepo.findOne({
            where: { id },
            relations: ['genres', 'authors'],
        });
    }

    async getBooks(): Promise<BookEntity[]> {
        return await this.bookRepo.find({ relations: ['authors', 'genres'] })
    }
}
