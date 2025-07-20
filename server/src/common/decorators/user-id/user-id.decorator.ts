import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Request } from "express";

export const UserId = createParamDecorator((_: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request & { userId: string }>();
    return request.userId;
});
