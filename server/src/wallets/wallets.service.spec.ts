import { Test, TestingModule } from "@nestjs/testing";
import { WalletsService } from "./wallets.service";
import {
    createTestTransactions,
    createTestUser,
    createTestWallets,
    truncateAllTables
} from "test/utils";
import { PrismaModule } from "src/prisma/prisma.module";
import { randomUUID } from "crypto";
import { errorMessages } from "src/constants/errorMessages";
import { PrismaService } from "src/prisma/prisma.service";
import { Wallet } from "generated/prisma";

const sortById = (a: Wallet, b: Wallet) => a.id.localeCompare(b.id);

describe("WalletsService", () => {
    let walletsService: WalletsService;
    let prismaService: PrismaService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [PrismaModule],
            providers: [WalletsService, PrismaService]
        }).compile();

        walletsService = module.get<WalletsService>(WalletsService);
        prismaService = module.get<PrismaService>(PrismaService);

        await truncateAllTables();
    });

    describe(".getWallets", () => {
        it("should retrieve all wallets for a user", async () => {
            const { id: userId, name } = await createTestUser();
            const { id: anotherUserId } = await createTestUser();

            const testWallets = await createTestWallets(userId);
            await createTestWallets(anotherUserId);
            const testWalletsWithOwnerName = testWallets.map(({ ...rest }) => ({
                ...rest,
                ownerName: name
            }));

            expect(await walletsService.getWallets(userId)).toStrictEqual(testWalletsWithOwnerName);
        });
    });

    describe(".getWallet", () => {
        it("should retrieve a wallet by its id", async () => {
            const { id: userId, name } = await createTestUser();

            const testWallets = await createTestWallets(userId);
            const targetWallet = testWallets[3];

            expect(await walletsService.getWallet(targetWallet.id, userId)).toStrictEqual({
                ...targetWallet,
                ownerName: name
            });
        });

        it("should throw an error when accessing a non-existent wallet", async () => {
            const { id: userId } = await createTestUser();

            const nonExistentWalletId = randomUUID();

            await expect(walletsService.getWallet(nonExistentWalletId, userId)).rejects.toThrow(
                errorMessages.wallet.NOT_FOUND
            );
        });

        it("should throw an error when accessing another user's wallet", async () => {
            const { id: currentUserId } = await createTestUser();
            const { id: walletOwnerId } = await createTestUser();

            const testWallets = await createTestWallets(walletOwnerId);

            await expect(
                walletsService.getWallet(testWallets[1].id, currentUserId)
            ).rejects.toThrow(errorMessages.wallet.NOT_FOUND);
        });
    });

    describe(".createWallet", () => {
        it("should create a wallet", async () => {
            const { id: userId } = await createTestUser();

            const testWallets = await createTestWallets(userId);

            const oldWalletsAmount = testWallets.length;

            const createdWalletName = "Created Wallet";
            const createdWallet = await walletsService.createWallet(createdWalletName, userId);

            expect(createdWallet.name).toBe(createdWalletName);

            const newWalletsAmount = (await walletsService.getWallets(userId)).length;

            expect(oldWalletsAmount + 1).toBe(newWalletsAmount);
        });
    });

    describe(".changeWalletName", () => {
        it("should change the wallet name", async () => {
            const { id: userId } = await createTestUser();

            const testWallets = await createTestWallets(userId);

            const oldTestWallet = testWallets[3];

            const newWalletName = "New Wallet Name";
            const updatedWallet = await walletsService.changeWalletName(
                oldTestWallet.id,
                userId,
                newWalletName
            );

            expect(updatedWallet.name).toBe(newWalletName);
        });

        it("should throw an error when changing the name of a non-existent wallet", async () => {
            const { id: userId } = await createTestUser();

            const nonExistentWalletId = randomUUID();

            await expect(
                walletsService.changeWalletName(nonExistentWalletId, userId, "Test Name")
            ).rejects.toThrow(errorMessages.wallet.NOT_FOUND);
        });

        it("should throw an error when changing the name of another user's wallet", async () => {
            const { id: currentUserId } = await createTestUser();
            const { id: walletOwnerId } = await createTestUser();

            const testWallets = await createTestWallets(walletOwnerId);

            await expect(
                walletsService.changeWalletName(testWallets[1].id, currentUserId, "New Wallet Name")
            ).rejects.toThrow(errorMessages.wallet.NOT_FOUND);
        });
    });

    describe(".deleteWallet", () => {
        it("should delete a wallet", async () => {
            const { id: userId } = await createTestUser();

            const testWallets = await createTestWallets(userId);

            const oldWalletsAmount = testWallets.length;

            const walletIdToDelete = testWallets[0].id;

            await walletsService.deleteWallet(walletIdToDelete, userId);

            const newWallets = await walletsService.getWallets(userId);

            expect(newWallets.find((wallet) => wallet.id === walletIdToDelete)).toBe(undefined);

            expect(oldWalletsAmount - 1).toBe(newWallets.length);
        });

        it("should throw an error when deleting a non-existent wallet", async () => {
            const { id: userId } = await createTestUser();

            const nonExistentWalletId = randomUUID();

            await expect(walletsService.deleteWallet(nonExistentWalletId, userId)).rejects.toThrow(
                errorMessages.wallet.NOT_FOUND
            );
        });

        it("should throw an error when deleting another user's wallet", async () => {
            const { id: currentUserId } = await createTestUser();
            const { id: walletOwnerId } = await createTestUser();

            const testWallets = await createTestWallets(walletOwnerId);

            await expect(
                walletsService.deleteWallet(testWallets[1].id, currentUserId)
            ).rejects.toThrow(errorMessages.wallet.NOT_FOUND);
        });
    });

    describe(".checkIfUserHaveAccessToWallet", () => {
        it("should return true if the user has access to the wallet", async () => {
            const { id: currentUserId } = await createTestUser();
            await createTestUser();

            const testWallets = await createTestWallets(currentUserId);

            expect(
                await walletsService.checkIfUserHaveAccessToWallet(testWallets[1].id, currentUserId)
            ).toBe(true);
        });

        it("should return false if the user does not have access to the wallet", async () => {
            const { id: currentUserId } = await createTestUser();
            const { id: walletOwnerId } = await createTestUser();

            const testWallets = await createTestWallets(walletOwnerId);

            expect(
                await walletsService.checkIfUserHaveAccessToWallet(testWallets[1].id, currentUserId)
            ).toBe(false);
        });
    });

    describe(".getWalletIncomeOrExpense", () => {
        it("should get wallet income amount correctly", async () => {
            const { id: userId } = await createTestUser();

            const testWallets = await createTestWallets(userId);

            const targetWallet = testWallets[3];
            const testTransactions = await createTestTransactions(targetWallet.id);

            expect(
                await walletsService.getWalletIncomeOrExpense(targetWallet.id, userId, "income")
            ).toBe(
                testTransactions.reduce(
                    (acc, transaction) =>
                        acc + (transaction.type === "income" ? transaction.amount : 0),
                    0
                )
            );
        });

        it("should get wallet expense amount correctly", async () => {
            const { id: userId } = await createTestUser();

            const testWallets = await createTestWallets(userId);

            const targetWallet = testWallets[3];
            const testTransactions = await createTestTransactions(targetWallet.id);

            expect(
                await walletsService.getWalletIncomeOrExpense(targetWallet.id, userId, "expense")
            ).toBe(
                testTransactions.reduce(
                    (acc, transaction) =>
                        acc + (transaction.type === "expense" ? transaction.amount : 0),
                    0
                )
            );
        });
    });

    describe(".getWalletBalance", () => {
        it("should get wallet balance correctly", async () => {
            const { id: userId } = await createTestUser();

            const testWallets = await createTestWallets(userId);

            const targetWallet = testWallets[3];
            const testTransactions = await createTestTransactions(targetWallet.id);

            expect(await walletsService.getWalletBalance(targetWallet.id, userId)).toBe(
                testTransactions.reduce(
                    (acc, transaction) =>
                        transaction.type === "income"
                            ? acc + transaction.amount
                            : acc - transaction.amount,
                    0
                )
            );
        });
    });

    describe(".getWalletAccessUsers", () => {
        it("should list users who have access to the wallet", async () => {
            const { password: _p1, ...user1 } = await createTestUser();
            const { password: _p2, ...user2 } = await createTestUser();
            const { password: _p3, ...user3 } = await createTestUser();
            await createTestUser();

            const testWallets = await createTestWallets(user1.id);
            const targetWallet = testWallets[3];

            await prismaService.wallet.update({
                where: { id: targetWallet.id },
                data: {
                    usersHaveAccess: {
                        connect: [{ id: user2.id }, { id: user3.id }]
                    }
                }
            });

            const result = await walletsService.getWalletAccessUsers(targetWallet.id, user1.id);
            expect(result.sort(sortById)).toEqual([user2, user3].sort(sortById));
        });

        it("should throw an error if trying to get the list of users with access when not an owner", async () => {
            const { password: _p1, ...user1 } = await createTestUser();
            const { password: _p2, ...user2 } = await createTestUser();
            const { password: _p3, ...user3 } = await createTestUser();
            await createTestUser();

            const testWallets = await createTestWallets(user1.id);
            const targetWallet = testWallets[3];

            await prismaService.wallet.update({
                where: { id: targetWallet.id },
                data: {
                    usersHaveAccess: {
                        connect: [{ id: user2.id }, { id: user3.id }]
                    }
                }
            });

            await expect(
                walletsService.getWalletAccessUsers(targetWallet.id, user2.id)
            ).rejects.toThrow(errorMessages.wallet.NOT_FOUND);
        });
    });

    describe(".removeUserWalletAccess", () => {
        it("should remove the user access to a wallet", async () => {
            const { password: _p1, ...user1 } = await createTestUser();
            const { password: _p2, ...user2 } = await createTestUser();
            const { password: _p3, ...user3 } = await createTestUser();
            const { password: _p4, ...user4 } = await createTestUser();

            const testWallets = await createTestWallets(user1.id);
            const targetWallet = testWallets[3];

            await prismaService.wallet.update({
                where: { id: targetWallet.id },
                data: {
                    usersHaveAccess: {
                        connect: [{ id: user2.id }, { id: user3.id }, { id: user4.id }]
                    }
                }
            });

            await walletsService.removeUserWalletAccess(targetWallet.id, user3.id, user1.id);

            const result = await walletsService.getWalletAccessUsers(targetWallet.id, user1.id);
            expect(result.sort(sortById)).toEqual([user2, user4].sort(sortById));
        });

        it("should throw an error if trying to remove the user access to the wallet when not an owner", async () => {
            const { password: _p1, ...user1 } = await createTestUser();
            const { password: _p2, ...user2 } = await createTestUser();
            const { password: _p3, ...user3 } = await createTestUser();
            const { password: _p4, ...user4 } = await createTestUser();

            const testWallets = await createTestWallets(user1.id);
            const targetWallet = testWallets[3];

            await prismaService.wallet.update({
                where: { id: targetWallet.id },
                data: {
                    usersHaveAccess: {
                        connect: [{ id: user2.id }, { id: user3.id }, { id: user4.id }]
                    }
                }
            });

            await expect(
                walletsService.removeUserWalletAccess(targetWallet.id, user3.id, user2.id)
            ).rejects.toThrow(errorMessages.wallet.NOT_FOUND);

            expect(
                await walletsService.getWalletAccessUsers(targetWallet.id, user1.id)
            ).toStrictEqual([user2, user3, user4]);
        });
    });
});
