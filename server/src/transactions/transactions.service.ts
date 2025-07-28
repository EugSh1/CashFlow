import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { isPrismaNotFoundError } from "src/utils/isPrismaNotFoundError";
import whereWalletOwnerOrHaveAccess from "src/utils/whereWalletOwnerOrHaveAccess";
import { WalletsService } from "src/wallets/wallets.service";
import { TransactionDto } from "./dto/create-transaction.dto";
import { errorMessages } from "src/constants/errorMessages";

@Injectable()
export class TransactionsService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly walletService: WalletsService
    ) {}

    async getTransactionsPaginated(walletId: string, userId: string, page: number) {
        const limit = 30;
        const transactions = await this.prismaService.transaction.findMany({
            where: {
                walletId,
                ...whereWalletOwnerOrHaveAccess(userId)
            },
            skip: (page - 1) * limit,
            take: limit,
            orderBy: [{ createdAt: "desc" }, { id: "desc" }]
        });

        const transactionsCount = await this.prismaService.transaction.count({
            where: {
                walletId,
                ...whereWalletOwnerOrHaveAccess(userId)
            }
        });
        const hasMore = page * limit < transactionsCount;

        return {
            transactions,
            hasMore,
            nextPage: hasMore ? page + 1 : -1
        };
    }

    async createTransaction(walletId: string, userId: string, transaction: TransactionDto) {
        const hasAccessToWallet = await this.walletService.checkIfUserHaveAccessToWallet(
            walletId,
            userId
        );

        if (!hasAccessToWallet) {
            throw new ForbiddenException(errorMessages.wallet.NO_ACCESS);
        }

        return this.prismaService.transaction.create({ data: { ...transaction, walletId } });
    }

    async updateTransaction(transactionId: string, userId: string, newTransaction: TransactionDto) {
        try {
            return await this.prismaService.transaction.update({
                where: {
                    id: transactionId,
                    ...whereWalletOwnerOrHaveAccess(userId)
                },
                data: newTransaction
            });
        } catch (error) {
            if (isPrismaNotFoundError(error)) {
                throw new NotFoundException(errorMessages.transaction.NOT_FOUND);
            }
            throw error;
        }
    }

    async deleteTransaction(transactionId: string, userId: string) {
        try {
            return await this.prismaService.transaction.delete({
                where: { id: transactionId, ...whereWalletOwnerOrHaveAccess(userId) }
            });
        } catch (error) {
            if (isPrismaNotFoundError(error)) {
                throw new NotFoundException(errorMessages.transaction.NOT_FOUND);
            }
            throw error;
        }
    }

    async deleteMultipleTransactions(transactionIds: string[], userId: string) {
        try {
            return await this.prismaService.transaction.deleteMany({
                where: { id: { in: transactionIds }, ...whereWalletOwnerOrHaveAccess(userId) }
            });
        } catch (error) {
            if (isPrismaNotFoundError(error)) {
                throw new NotFoundException(errorMessages.transaction.NOT_FOUND);
            }
            throw error;
        }
    }
}
