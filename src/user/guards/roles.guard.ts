import { GqlExecutionContext } from '@nestjs/graphql';
import { CanActivate, Injectable, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(private readonly reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean {
		const roles = this.reflector.get<string[]>('roles', context.getHandler());

		if(!roles) {
			return false;
		}

		const request = GqlExecutionContext.create(context);
		const user = request.getContext().req.user;

		return roles.some((role) => {
			return role === user.role
		});
	}
}