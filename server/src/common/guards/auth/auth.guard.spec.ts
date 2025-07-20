import { JwtService } from "@nestjs/jwt";
import { AuthGuard } from "./auth.guard";
import { ExecutionContext } from "@nestjs/common";

describe("AuthGuard", () => {
    let guard: AuthGuard;
    let jwtService: JwtService;

    beforeEach(() => {
        jwtService = new JwtService({ secret: process.env.JWT_SECRET });
        guard = new AuthGuard(jwtService);
    });

    it("should return true and attach userId for a valid token", async () => {
        const token = await jwtService.signAsync({ sub: "user-id" });

        const request = { cookies: { token } };

        const context = {
            switchToHttp: () => ({
                getRequest: () => request
            })
        } as unknown as ExecutionContext;

        const canActivate = await guard.canActivate(context);

        expect(canActivate).toBe(true);
        expect(request["userId"]).toBe("user-id");
    });

    it("should throw UnauthorizedException for an invalid token", async () => {
        const request = { cookies: { token: "invalid-token" } };
        const context = {
            switchToHttp: () => ({
                getRequest: () => request
            })
        } as unknown as ExecutionContext;

        await expect(guard.canActivate(context)).rejects.toThrow("Unauthorized");
    });

    it("should return false when no token is provided", async () => {
        const request = { cookies: {} };
        const context = {
            switchToHttp: () => ({
                getRequest: () => request
            })
        } as unknown as ExecutionContext;

        const canActivate = await guard.canActivate(context);

        expect(canActivate).toBe(false);
    });
});
