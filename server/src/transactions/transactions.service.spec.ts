import { Test, TestingModule } from "@nestjs/testing";
import { TransactionsService } from "./transactions.service";
import { PrismaModule } from "src/prisma/prisma.module";
import { WalletsModule } from "src/wallets/wallets.module";
import { JwtModule } from "@nestjs/jwt";
import {
    createTestTransactions,
    createTestUser,
    createTestWallet,
    truncateAllTables
} from "test/utils";
import { PrismaService } from "src/prisma/prisma.service";
import { errorMessages } from "src/constants/errorMessages";

describe("TransactionsService", () => {
    let transactionsService: TransactionsService;
    let prismaService: PrismaService;

    const newTransaction: Parameters<typeof transactionsService.createTransaction>[2] = {
        name: "New Transaction Name",
        amount: 120,
        type: "expense"
    };

    const updatedTransactionInfo: Parameters<typeof transactionsService.updateTransaction>[2] = {
        name: "Updated Transaction Name",
        amount: 100,
        type: "income"
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [PrismaModule, WalletsModule, JwtModule.register({ secret: "test" })],
            providers: [TransactionsService]
        }).compile();

        transactionsService = module.get<TransactionsService>(TransactionsService);
        prismaService = module.get<PrismaService>(PrismaService);

        await truncateAllTables();
    });

    describe(".getTransactionsPaginated", () => {
        it("should return pages with a maximum of 30 transactions", async () => {
            const { id: userId } = await createTestUser();
            const { id: walletId } = await createTestWallet(userId);
            await createTestTransactions(walletId, 74);

            const getPage = async (page: number) =>
                await transactionsService.getTransactionsPaginated(walletId, userId, page);

            const firstPage = await getPage(1);
            expect(firstPage.transactions.length).toBe(30);
            expect(firstPage.hasMore).toBe(true);
            expect(firstPage.nextPage).toBe(2);

            const secondPage = await getPage(2);
            expect(secondPage.transactions.length).toBe(30);
            expect(secondPage.hasMore).toBe(true);
            expect(secondPage.nextPage).toBe(3);

            const thirdPage = await getPage(3);
            expect(thirdPage.transactions.length).toBe(14);
            expect(thirdPage.hasMore).toBe(false);
            expect(thirdPage.nextPage).toBe(-1);
        });
    });

    describe(".createTransaction", () => {
        it("should create a transaction", async () => {
            const { id: userId } = await createTestUser();
            const { id: walletId } = await createTestWallet(userId);
            const prevTransactions = await createTestTransactions(walletId, 2);

            const prevTransactionAmount = prevTransactions.length;

            const createdTransaction = await transactionsService.createTransaction(
                walletId,
                userId,
                newTransaction
            );

            const newTransactions = await prismaService.transaction.findMany({
                where: { walletId }
            });

            expect(createdTransaction.id).not.toBeUndefined();
            expect(createdTransaction.walletId).not.toBeUndefined();
            expect(createdTransaction.name).toBe(newTransaction.name);
            expect(createdTransaction.amount).toBe(newTransaction.amount);
            expect(createdTransaction.type).toBe(newTransaction.type);

            expect(prevTransactionAmount + 1).toBe(newTransactions.length);
        });

        it("should throw an error when creating a transaction in a wallet the user cannot access", async () => {
            const { id: userId1 } = await createTestUser();
            const { id: userId2 } = await createTestUser();
            const { id: walletId } = await createTestWallet(userId2);

            await expect(
                transactionsService.createTransaction(walletId, userId1, newTransaction)
            ).rejects.toThrow(errorMessages.wallet.NO_ACCESS);
        });

        it("should throw an error when creating a transaction in a non-existent wallet", async () => {
            const { id: userId } = await createTestUser();

            await expect(
                transactionsService.createTransaction(
                    "non-existent-wallet-id",
                    userId,
                    newTransaction
                )
            ).rejects.toThrow(errorMessages.wallet.NO_ACCESS);
        });
    });

    describe(".updateTransaction", () => {
        it("should update a transaction", async () => {
            const { id: userId } = await createTestUser();
            const { id: walletId } = await createTestWallet(userId);
            const prevTransactions = await createTestTransactions(walletId, 3);

            const updatedTransaction = await transactionsService.updateTransaction(
                prevTransactions[1].id,
                userId,
                updatedTransactionInfo
            );

            const {
                id: _1,
                walletId: _2,
                createdAt: _3,
                ...updatedTransactionWithoutIdsAndDate
            } = updatedTransaction;

            expect(updatedTransactionWithoutIdsAndDate).toStrictEqual(updatedTransactionInfo);
        });

        it("should throw an error when updating a transaction in a wallet the user cannot access", async () => {
            const { id: userId1 } = await createTestUser();
            const { id: userId2 } = await createTestUser();
            const { id: walletId } = await createTestWallet(userId2);
            const createdTransactions = await createTestTransactions(walletId, 1);
            const { id: transactionId } = createdTransactions[0];

            await expect(
                transactionsService.updateTransaction(transactionId, userId1, newTransaction)
            ).rejects.toThrow(errorMessages.transaction.NOT_FOUND);
        });

        it("should throw an error when updating a non-existent transaction", async () => {
            const { id: userId } = await createTestUser();

            await expect(
                transactionsService.updateTransaction(
                    "non-existent-transaction-id",
                    userId,
                    newTransaction
                )
            ).rejects.toThrow(errorMessages.transaction.NOT_FOUND);
        });
    });

    describe(".deleteTransaction", () => {
        it("should delete a transaction", async () => {
            const { id: userId } = await createTestUser();
            const { id: walletId } = await createTestWallet(userId);
            const prevTransactions = await createTestTransactions(walletId, 3);
            const { id: transactionIdToDelete } = prevTransactions[1];

            const prevTransactionAmount = prevTransactions.length;

            await transactionsService.deleteTransaction(transactionIdToDelete, userId);

            const newTransactions = await prismaService.transaction.findMany({
                where: { walletId }
            });

            expect(prevTransactionAmount - 1).toBe(newTransactions.length);
        });

        it("should throw an error when deleting a transaction in a wallet the user cannot access", async () => {
            const { id: userId1 } = await createTestUser();
            const { id: userId2 } = await createTestUser();
            const { id: walletId } = await createTestWallet(userId2);
            const prevTransactions = await createTestTransactions(walletId, 3);
            const { id: transactionIdToDelete } = prevTransactions[1];

            await expect(
                transactionsService.deleteTransaction(transactionIdToDelete, userId1)
            ).rejects.toThrow(errorMessages.transaction.NOT_FOUND);
        });

        it("should throw an error when deleting a non-existent transaction", async () => {
            const { id: userId } = await createTestUser();

            await expect(
                transactionsService.deleteTransaction("non-existent-transaction-id", userId)
            ).rejects.toThrow(errorMessages.transaction.NOT_FOUND);
        });
    });

    describe(".deleteMultipleTransactions", () => {
        it("should delete multiple transactions correctly", async () => {
            const { id: userId } = await createTestUser();
            const { id: walletId } = await createTestWallet(userId);
            const prevTransactions = await createTestTransactions(walletId, 5);
            const { id: transactionIdToDelete1 } = prevTransactions[1];
            const { id: transactionIdToDelete2 } = prevTransactions[3];

            const prevTransactionAmount = prevTransactions.length;

            await transactionsService.deleteMultipleTransactions(
                [transactionIdToDelete1, transactionIdToDelete2],
                userId
            );

            const newTransactions = await prismaService.transaction.findMany({
                where: { walletId }
            });

            expect(prevTransactionAmount - 2).toBe(newTransactions.length);
        });

        it("should not delete transactions if trying to delete multiple transactions in a wallet to which user has no access", async () => {
            const { id: userId1 } = await createTestUser();
            const { id: userId2 } = await createTestUser();
            const { id: walletId } = await createTestWallet(userId2);
            const prevTransactions = await createTestTransactions(walletId, 3);
            const { id: transactionIdToDelete1 } = prevTransactions[1];
            const { id: transactionIdToDelete2 } = prevTransactions[2];

            const prevTransactionAmount = prevTransactions.length;

            await transactionsService.deleteMultipleTransactions(
                [transactionIdToDelete1, transactionIdToDelete2],
                userId1
            );

            const newTransactions = await prismaService.transaction.findMany({
                where: { walletId }
            });

            expect(newTransactions.length).toBe(prevTransactionAmount);
        });
    });
});
