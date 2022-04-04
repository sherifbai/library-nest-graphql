import { GqlExecutionContext } from '@nestjs/graphql';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator(
	(_data: unknown, ctx: ExecutionContext) => {
		if(ctx.getType() == 'http') {
			return ctx.switchToHttp().getRequest().user;
		}
		const request = GqlExecutionContext.create(ctx);
		return request.getContext().req.user;
	}
);