import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserResolver } from './user.resolver';
import { UserEntity } from './user.entity';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from 'src/configs/jwt.config';
import { JWTStrategy } from './strategies/jwt.strategy';

@Module({
	imports: [
		TypeOrmModule.forFeature([UserEntity]),
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: jwtConfig
		}),
		ConfigModule,
	],
	providers: [UserService, UserResolver, JWTStrategy]
})
export class UserModule {}
