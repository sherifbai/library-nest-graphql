import { UpdateBookInput } from './dto/inputs/update.book.input';
import { GenreEntity } from './../genre/genre.entity';
import { AuthorEntity } from './../author/author.entity';
import { CreateBookInput } from './dto/inputs/create.book.input';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult, In } from 'typeorm';
import { BookEntity } from './book.entity';
import { BookArgs } from './dto/args/book.args';

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
        const genres_list = await this.genreRepo.findBy({ id: In(genres) });
        const authors_list = await this.authorRepo.findBy({ id: In(authors) });
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
        const authors_list = await this.authorRepo.findBy({ id: In(authors) });
        const genres_list = await this.genreRepo.findBy({ id: In(genres) });

        const book = await this.bookRepo.findOne({ where: { id } });

        book.name = name.toLowerCase().trim();
        book.authors = authors_list;
        book.genres = genres_list;

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
        return await this.bookRepo.find({ relations: ['genres', 'authors'] });
    }
}
