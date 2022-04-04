import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
	role: UserRole ;
}
