import { GenreEntity } from './../genre/genre.entity';
import { AuthorEntity } from './../author/author.entity';
import { BookResolver } from './book.resolver';
import { BookService } from './book.service';
import { BookEntity } from './book.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

@Module({
    imports: [TypeOrmModule.forFeature([BookEntity, AuthorEntity, GenreEntity])],
    providers: [BookService, BookResolver],
})
export class BookModule {}
