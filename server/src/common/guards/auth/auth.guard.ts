import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request>();
        const token = request.cookies["token"] as string;

        if (!token) {
            return false;
        }
        try {
            const payload = await this.jwtService.verifyAsync<{ sub: string }>(token, {
                secret: process.env.JWT_SECRET
            });

            request["userId"] = payload.sub;
        } catch {
            throw new UnauthorizedException();
        }

        return true;
    }
}
