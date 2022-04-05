import { UpdateGenreInput } from './dto/inputs/update.genre.input';
import { GenreEntity } from './genre.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { CreateGenreInput } from './dto/inputs/create.genre.input';
import { GenreArgs } from './dto/args/genre.args';

@Injectable()
export class GenreService {
    constructor(
        @InjectRepository(GenreEntity)
        private readonly genreRepo: Repository<GenreEntity>,
    ) {}

    async createGenre({ name }: CreateGenreInput): Promise<GenreEntity> {
        const genre = await this.genreRepo.create({ name: name.toLowerCase().trim() });

        return await this.genreRepo.save(genre);
    }

    async getGenres() {
        return await this.genreRepo.find();
    }

    async updateGenre({ name }: UpdateGenreInput, { id }: GenreArgs): Promise<GenreEntity> {
        await this.genreRepo.update(id, { name: name.toLowerCase().trim() });
        return await this.genreRepo.findOne({ where: { id } });
    }

    async deleteGenre({ id }: GenreArgs): Promise<DeleteResult> {
        return await this.genreRepo.delete(id);
    }

    async findGenreById({ id }: GenreArgs) {
        return await this.genreRepo.findOne({ where: { id } });
    }

    async findGenreByName(name: string): Promise<GenreEntity> {
        return await this.genreRepo.findOne({ where: { name } });
    }
}
