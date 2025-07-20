import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { JwtModule, JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { UsersModule } from "src/users/users.module";
import { createTestUserWithHashedPassword, truncateAllTables } from "test/utils";
import { PrismaModule } from "src/prisma/prisma.module";
import { PrismaService } from "src/prisma/prisma.service";

describe("AuthService", () => {
    let authService: AuthService;
    let jwtService: JwtService;
    let prismaService: PrismaService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                JwtModule.register({
                    secret: process.env.JWT_SECRET
                }),
                UsersModule,
                PrismaModule
            ],
            providers: [AuthService, PrismaService]
        }).compile();

        authService = module.get<AuthService>(AuthService);
        jwtService = module.get<JwtService>(JwtService);
        prismaService = module.get<PrismaService>(PrismaService);

        await truncateAllTables();
    });

    describe("AuthService.register", () => {
        it("should create a user and hash the password", async () => {
            const name = "Test user for testing AuthService";
            const password = "some-password";
            const user = await authService.register(name, password);

            const createdUser = await prismaService.user.findUnique({ where: { name } });

            expect(user.id).not.toBeUndefined();
            expect(user.name).toBe(name);
            expect(await bcrypt.compare(password, createdUser?.password || "")).toBe(true);
        });
    });

    describe("AuthService.login", () => {
        it("should return a JWT token if the username and password are correct", async () => {
            const { user, initialPassword } = await createTestUserWithHashedPassword();
            const token = await authService.logIn(user.name, initialPassword);

            const payload = await jwtService.verifyAsync<{ sub: string }>(token, {
                secret: process.env.JWT_SECRET
            });
            expect(payload.sub).not.toBeUndefined();
        });

        it("should throw UnauthorizedException if the password is incorrect", async () => {
            const { user } = await createTestUserWithHashedPassword();
            const password = "some-invalid-password";
            await expect(authService.logIn(user.name, password)).rejects.toThrow(
                "Invalid credentials"
            );
        });

        it("should throw UnauthorizedException if the username is incorrect", async () => {
            const { initialPassword } = await createTestUserWithHashedPassword();
            const name = "Invalid name";
            await expect(authService.logIn(name, initialPassword)).rejects.toThrow(
                "Invalid credentials"
            );
        });
    });
});
