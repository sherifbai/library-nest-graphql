import { UpdateAuthorInput } from './dto/inputs/update.author.input';
import { AuthorArgs } from './dto/args/author.args';
import { AuthorEntity } from './author.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';
import { CreateAuthorInput } from './dto/inputs/create.author.input';

@Injectable()
export class AuthorService {
    constructor(
        @InjectRepository(AuthorEntity)
        private readonly authorRepo: Repository<AuthorEntity>,
    ) {}

    async createAuthor({ name }: CreateAuthorInput): Promise<AuthorEntity> {
        const author = this.authorRepo.create({ name: name.toLowerCase().trim() });

        return await this.authorRepo.save(author);
    }

    async getAuthors(): Promise<AuthorEntity[]> {
        return await this.authorRepo.find();
    }

    async updateAuthor(
        { id }: AuthorArgs,
        { name }: UpdateAuthorInput,
    ): Promise<AuthorEntity> {
        await this.authorRepo.update(id, { name: name.toLowerCase().trim() });

        return await this.authorRepo.findOne({ where: { id } });
    }

    async deleteAuthor({ id }: AuthorArgs): Promise<DeleteResult> {
        return await this.authorRepo.delete(id);
    }

    async findAuthorById({ id }: AuthorArgs): Promise<AuthorEntity> {
        return await this.authorRepo.findOne({ where: { id } });
    }

    async findAuthorByName({ name }: CreateAuthorInput): Promise<AuthorEntity> {
        return await this.authorRepo.findOne({ where: { name } });
    }
}
