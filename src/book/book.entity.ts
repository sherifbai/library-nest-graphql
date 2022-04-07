import { GenreEntity } from './../genre/genre.entity';
import { AuthorEntity } from './../author/author.entity';
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
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

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updated_at: Date;

    @DeleteDateColumn({ type: 'timestamp' })
    deleted_at: Date;
}
