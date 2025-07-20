import { Test, TestingModule } from "@nestjs/testing";
import { UsersService } from "./users.service";
import { PrismaModule } from "src/prisma/prisma.module";
import { PrismaService } from "src/prisma/prisma.service";
import { createTestUser, createTestUserWithHashedPassword, truncateAllTables } from "test/utils";
import { errorMessages } from "src/constants/errorMessages";

describe("UsersService", () => {
    let usersService: UsersService;
    let prismaService: PrismaService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [PrismaModule],
            providers: [UsersService, PrismaService]
        }).compile();

        usersService = module.get<UsersService>(UsersService);
        prismaService = module.get<PrismaService>(PrismaService);

        await truncateAllTables();
    });

    describe(".getUserById", () => {
        it("should return a user by id without the password hash", async () => {
            const user = await createTestUser();
            const { password: _, ...userWithoutPassword } = user;

            expect(await usersService.getUserById(user.id)).toStrictEqual(userWithoutPassword);
        });

        it("should return a user by id with the password hash", async () => {
            const user = await createTestUser();

            expect(await usersService.getUserById(user.id, false)).toStrictEqual(user);
        });

        it("should throw an error when retrieving a non-existent user", async () => {
            await expect(usersService.getUserById("non-existent-user-id")).rejects.toThrow(
                errorMessages.user.NOT_FOUND
            );
        });
    });

    describe(".getUserByName", () => {
        it("should return a user by name", async () => {
            const user = await createTestUser();

            expect(await usersService.getUserByName(user.name)).toStrictEqual(user);
        });

        it("should throw an error when retrieving a non-existent user", async () => {
            await expect(usersService.getUserByName("non-existent-user-name")).rejects.toThrow(
                errorMessages.user.NOT_FOUND
            );
        });
    });

    describe(".createUser", () => {
        it("should create a user", async () => {
            const newUser = await usersService.createUser({
                name: "my-user-name",
                password: "my-user-password"
            });
            expect(newUser.id).not.toBeUndefined();
            expect(newUser.name).toBe("my-user-name");
            expect(newUser.id).not.toBeUndefined();
        });

        it("should throw an error when creating a user with an already used name", async () => {
            const { name: occupiedName } = await createTestUser();

            await expect(
                usersService.createUser({ name: occupiedName, password: "my-user-password" })
            ).rejects.toThrow(errorMessages.user.NAME_OCCUPIED);
        });
    });

    describe(".changeName", () => {
        it("should change the user's name", async () => {
            const { id } = await createTestUser();

            expect(await usersService.changeName(id, "new-user-name")).toStrictEqual({
                id,
                name: "new-user-name"
            });
        });

        it("should throw an error when changing the name of a non-existent user", async () => {
            await expect(
                usersService.changeName("non-existent-user-id", "new-user-name")
            ).rejects.toThrow(errorMessages.user.NOT_FOUND);
        });

        it("should throw an error when changing the name to an already used name", async () => {
            const { name: occupiedName } = await createTestUser();
            const { id } = await createTestUser();

            await expect(usersService.changeName(id, occupiedName)).rejects.toThrow(
                errorMessages.user.NAME_OCCUPIED
            );
        });
    });

    describe(".changePassword", () => {
        it("should change the user's password", async () => {
            const { user, initialPassword } = await createTestUserWithHashedPassword();

            const updatedUser = await usersService.changePassword(
                user.id,
                initialPassword,
                "new-password"
            );

            const updatedUserFromDb = await prismaService.user.findUnique({
                where: { id: user.id }
            });

            expect(updatedUser.id).toBe(user.id);
            expect(updatedUser.name).toBe(user.name);
            expect(updatedUserFromDb?.password).not.toBe(user.password);
        });

        it("should throw an error when the old password does not match during password change", async () => {
            const { user } = await createTestUserWithHashedPassword();

            await expect(
                usersService.changePassword(user.id, "not-matching-password", "new-password")
            ).rejects.toThrow(errorMessages.auth.INVALID_CREDENTIALS);
        });
    });

    describe(".deleteUser", () => {
        it("should delete a user", async () => {
            const { id } = await createTestUser();

            await usersService.deleteUser(id);

            const foundUser = await prismaService.user.findUnique({
                where: { id }
            });

            expect(foundUser).toBeNull();
        });

        it("should throw an error when deleting a non-existent user", async () => {
            await expect(usersService.deleteUser("non-existent-user-id")).rejects.toThrow(
                errorMessages.user.NOT_FOUND
            );
        });
    });
});
