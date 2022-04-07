import { Field, ObjectType } from '@nestjs/graphql';
import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export enum UserRole {
    ADMIN = 'admin',
    MANAGER = 'manager',
    USER = 'user',
}

@Entity({ name: 'users' })
@ObjectType()
export class UserEntity {
    @PrimaryGeneratedColumn()
    @Field()
    id: number;

    @Column({ unique: true })
    @Field()
    username: string;

    @Column()
    @Field()
    password: string;

    @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
    @Field()
    role: UserRole;

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updated_at: Date;

    @DeleteDateColumn({ type: 'timestamp' })
    deleted_at: Date;
}
