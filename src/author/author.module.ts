import { AuthorEntity } from './author.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorResolver } from './author.resolver';
import { AuthorService } from './author.service';
import { Module } from '@nestjs/common';

@Module({
    imports: [TypeOrmModule.forFeature([AuthorEntity])],
    providers: [AuthorService, AuthorResolver],
    exports: [TypeOrmModule.forFeature([AuthorEntity])],
})
export class AuthorModule {}
