import { GenreEntity } from './../genre/genre.entity';
import { AuthorEntity } from './../author/author.entity';
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';

@Entity({ name: 'books' })
@ObjectType()
export class BookEntity {
    @PrimaryGeneratedColumn()
    @Field()
    id: number;

    @Column()
    @Field()
    name: string;

    @ManyToMany(() => AuthorEntity, authors => authors.id, { cascade: true })
    @JoinTable({ name: 'books_authors' })
    @Field(() => [AuthorEntity])
    authors: AuthorEntity[];

    @ManyToMany(() => GenreEntity, genres => genres.id, { cascade: true })
    @JoinTable({ name: 'books_genres' })
    @Field(() => [GenreEntity])
    genres: GenreEntity[];
}
