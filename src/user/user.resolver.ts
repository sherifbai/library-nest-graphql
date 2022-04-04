import { RolesGuard } from './guards/roles.guard';
import { JWTAuthGuard } from './guards/jwt.guard';
import { TokenResponse } from './dto/access.token.interface';
import { AuthUser } from './dto/inputs/auth.user';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserEntity, UserRole } from './user.entity';
import { UserService } from './user.service';
import {
    BadRequestException,
    UseGuards,
    NotFoundException,
} from '@nestjs/common';
import {
    USER_EXIST_ERROR,
    USER_NOT_FOUND_ERROR,
} from './errors/errors.constants';
import { Roles } from './decorators/roles.decorator';
import { UserArgs } from './dto/args/user.args';

@Resolver()
export class UserResolver {
    constructor(private readonly userService: UserService) {}

    @Mutation(() => UserEntity)
    async registration(
        @Args('createUserData') createUserData: AuthUser,
    ): Promise<UserEntity> {
        const user = await this.userService.findUserByUsername(
            createUserData.username,
        );

        if (user) {
            throw new BadRequestException(USER_EXIST_ERROR);
        }

        return await this.userService.registration(createUserData);
    }

    @Mutation(() => TokenResponse)
    async login(
        @Args('loginUserData') loginUserData: AuthUser,
    ): Promise<TokenResponse> {
        const user = await this.userService.validateUser(loginUserData);

        return await this.userService.login(user);
    }

    @UseGuards(JWTAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Mutation(() => UserEntity)
    async makeManager(@Args() { id }: UserArgs): Promise<UserEntity> {
        return await this.userService.makeManager(id);
    }

    @UseGuards(JWTAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Query(() => UserEntity)
    async getUser(@Args() { id }: UserArgs): Promise<UserEntity> {
        const user = await this.userService.findUserById({ id });

        if (!user) {
            throw new NotFoundException(USER_NOT_FOUND_ERROR);
        }

        return user;
    }

    @UseGuards(JWTAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Query(() => [UserEntity])
    async getUsers(): Promise<UserEntity[]> {
        return await this.userService.getUsers();
    }
}
