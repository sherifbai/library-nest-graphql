import { TypeOrmModule } from '@nestjs/typeorm';
import { GenreResolver } from './genre.resolver';
import { Module } from '@nestjs/common';
import { GenreService } from './genre.service';
import { GenreEntity } from './genre.entity';

@Module({
    imports: [TypeOrmModule.forFeature([GenreEntity])],
    providers: [GenreService, GenreResolver],
    exports: [TypeOrmModule.forFeature([GenreEntity])],
})
export class GenreModule {}
