import { ConfigService } from '@nestjs/config';
export const jwtConfig = async (configService: ConfigService) => {
	return { 
		secret: configService.get('JWT_SECRET'),
	}
}
