import { Field, ObjectType } from '@nestjs/graphql';
import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'authors' })
@ObjectType()
export class AuthorEntity {
    @PrimaryGeneratedColumn()
    @Field()
    id: number;

    @Column({ unique: true })
    @Field()
    name: string;

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updated_at: Date;

    @DeleteDateColumn({ type: 'timestamp' })
    deleted_at: Date;
}
