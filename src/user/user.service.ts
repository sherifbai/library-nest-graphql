import { AuthUser } from './dto/inputs/auth.user';
import { UserEntity, UserRole } from './user.entity';
import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { hash, genSalt, compare } from 'bcrypt';
import {
    USER_NOT_FOUND_ERROR,
    PASSWORD_DOES_NOT_MATCH_ERROR,
} from './errors/errors.constants';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepo: Repository<UserEntity>,
        private readonly jwtService: JwtService,
    ) {}

    async registration({ username, password }: AuthUser): Promise<UserEntity> {
        const salt = await genSalt(10);

        const user = await this.userRepo.create({
            username: username,
            password: await hash(password, salt),
        });

        return await this.userRepo.save(user);
    }

    async login(user: UserEntity): Promise<{ access_token: string }> {
        const payload = {
            username: user.username,
            id: user.id,
            role: user.role,
        };

        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }

    async getUsers(): Promise<UserEntity[]> {
        return await this.userRepo.find();
    }

    async validateUser({ username, password }: AuthUser): Promise<UserEntity> {
        const user = await this.findUserByUsername(username);

        if (!user) {
            throw new NotFoundException(USER_NOT_FOUND_ERROR);
        }

        const isEqual = await compare(password, user.password);

        if (!isEqual) {
            throw new BadRequestException(PASSWORD_DOES_NOT_MATCH_ERROR);
        }

        return user;
    }

    async makeManager(id: number): Promise<UserEntity> {
        await this.userRepo.update(id, { role: UserRole.MANAGER });
        return this.userRepo.findOne({ where: { id } });
    }

    async findUserById({ id }): Promise<UserEntity | null> {
        return await this.userRepo.findOne({ where: { id } });
    }

    async findUserByUsername(username: string): Promise<UserEntity | null> {
        return this.userRepo.findOne({ where: { username } });
    }
}
