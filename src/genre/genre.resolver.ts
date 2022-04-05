import { UpdateGenreInput } from './dto/inputs/update.genre.input';
import { UserRole } from './../user/user.entity';
import { RolesGuard } from './../user/guards/roles.guard';
import { JWTAuthGuard } from './../user/guards/jwt.guard';
import { GenreService } from './genre.service';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GenreEntity } from './genre.entity';
import { CreateGenreInput } from './dto/inputs/create.genre.input';
import {
    BadRequestException,
    NotFoundException,
    UseGuards,
} from '@nestjs/common';
import {
    GENRE_EXIST_ERROR,
    GENRE_NOT_FOUND_ERROR,
} from './errors/genre.error.constants';
import { Roles } from 'src/user/decorators/roles.decorator';
import { GenreArgs } from './dto/args/genre.args';

@UseGuards(JWTAuthGuard, RolesGuard)
@Resolver()
export class GenreResolver {
    constructor(private readonly genreService: GenreService) {}

    @Roles(UserRole.ADMIN, UserRole.MANAGER)
    @Mutation(() => GenreEntity)
    async createGenre(
        @Args('createGenreData') createGenreData: CreateGenreInput,
    ) {
        const genre = await this.genreService.findGenreByName(
            createGenreData.name,
        );

        if (genre) {
            throw new BadRequestException(GENRE_EXIST_ERROR);
        }

        return await this.genreService.createGenre(createGenreData);
    }

    @Roles(UserRole.ADMIN, UserRole.MANAGER)
    @Mutation(() => GenreEntity)
    async updateGenre(
        @Args('updateGenreInput') { name }: UpdateGenreInput,
        @Args() { id }: GenreArgs
    ) {
        const genre = await this.genreService.findGenreById({ id });

        if (!genre) {
            throw new NotFoundException(GENRE_NOT_FOUND_ERROR);
        }

        const genreNameExist = await this.genreService.findGenreByName(name);

        if (genreNameExist) {
            throw new BadRequestException(GENRE_EXIST_ERROR);
        }

        return await this.genreService.updateGenre({ name }, { id });
    }

    @Roles(UserRole.ADMIN, UserRole.MANAGER)
    @Mutation(() => GenreEntity, { nullable: true })
    async deleteGenre(@Args() { id }: GenreArgs): Promise<GenreEntity> {
        const genre = await this.genreService.findGenreById({ id });

        if (!genre) {
            throw new NotFoundException(GENRE_NOT_FOUND_ERROR);
        }

        await this.genreService.deleteGenre({ id });
        
        return genre;
    }

    @Roles(UserRole.ADMIN, UserRole.MANAGER)
    @Query(() => [GenreEntity])
    async getGenres() {
        return await this.genreService.getGenres();
    }

    @Roles(UserRole.ADMIN, UserRole.MANAGER)
    @Query(() => GenreEntity)
    async getGenre(@Args() { id }: GenreArgs) {
        const genre = await this.genreService.findGenreById({ id });

        if (!genre) {
            throw new NotFoundException(GENRE_NOT_FOUND_ERROR);
        }

        return genre;
    }
}
