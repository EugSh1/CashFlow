import { Injectable, NotFoundException } from "@nestjs/common";
import { errorMessages } from "src/constants/errorMessages";
import { PrismaService } from "src/prisma/prisma.service";
import { isPrismaNotFoundError } from "src/utils/isPrismaNotFoundError";
import whereOwnerOrHaveAccess from "src/utils/whereOwnerOrHaveAccess";
import whereWalletOwnerOrHaveAccess from "src/utils/whereWalletOwnerOrHaveAccess";

@Injectable()
export class WalletsService {
    constructor(private readonly prismaService: PrismaService) {}

    async getWallets(userId: string) {
        const wallets = await this.prismaService.wallet.findMany({
            where: {
                ...whereOwnerOrHaveAccess(userId)
            },
            include: {
                owner: { select: { name: true } }
            }
        });

        // Transform the result to flatten owner.name to ownerName
        return wallets.map(({ owner, ...rest }) => ({ ...rest, ownerName: owner.name }));
    }

    async getWallet(walletId: string, userId: string) {
        const wallet = await this.prismaService.wallet.findUnique({
            where: {
                id: walletId,
                ...whereOwnerOrHaveAccess(userId)
            },
            include: {
                owner: { select: { name: true } }
            }
        });

        if (!wallet) {
            throw new NotFoundException(errorMessages.wallet.NOT_FOUND);
        }

        // Transform the result to flatten owner.name to ownerName
        const { owner, ...walletWithoutOwner } = wallet;
        return { ...walletWithoutOwner, ownerName: owner.name };
    }

    async createWallet(name: string, userId: string) {
        return await this.prismaService.wallet.create({
            data: {
                name,
                ownerId: userId
            }
        });
    }

    async changeWalletName(walletId: string, userId: string, newName: string) {
        try {
            return await this.prismaService.wallet.update({
                where: { id: walletId, ownerId: userId },
                data: { name: newName }
            });
        } catch (error) {
            if (isPrismaNotFoundError(error)) {
                throw new NotFoundException(errorMessages.wallet.NOT_FOUND);
            }
            throw error;
        }
    }

    async deleteWallet(walletId: string, userId: string) {
        try {
            return await this.prismaService.wallet.delete({
                where: { id: walletId, ownerId: userId }
            });
        } catch (error) {
            if (isPrismaNotFoundError(error)) {
                throw new NotFoundException(errorMessages.wallet.NOT_FOUND);
            }
            throw error;
        }
    }

    async checkIfUserHaveAccessToWallet(walletId: string, userId: string) {
        return !!(await this.prismaService.wallet.findUnique({
            where: {
                id: walletId,
                ...whereOwnerOrHaveAccess(userId)
            }
        }));
    }

    async getWalletIncomeOrExpense(walletId: string, userId: string, type: "income" | "expense") {
        const aggregatedTransactions = await this.prismaService.transaction.aggregate({
            _sum: {
                amount: true
            },
            where: {
                walletId,
                ...whereWalletOwnerOrHaveAccess(userId),
                type
            }
        });

        return aggregatedTransactions._sum.amount || 0;
    }

    async getWalletBalance(walletId: string, userId: string) {
        const income = await this.getWalletIncomeOrExpense(walletId, userId, "income");
        const expense = await this.getWalletIncomeOrExpense(walletId, userId, "expense");

        return income - expense;
    }

    async getWalletAccessUsers(walletId: string, userId: string) {
        const foundWallet = await this.prismaService.wallet.findUnique({
            where: { id: walletId, ownerId: userId },
            select: { usersHaveAccess: { omit: { password: true } } }
        });

        if (!foundWallet) {
            throw new NotFoundException(errorMessages.wallet.NOT_FOUND);
        }

        return foundWallet.usersHaveAccess;
    }

    async removeUserWalletAccess(walletId: string, userIdToRemove: string, userId: string) {
        try {
            await this.prismaService.wallet.update({
                where: { id: walletId, ownerId: userId },
                data: { usersHaveAccess: { disconnect: { id: userIdToRemove } } }
            });
        } catch (error) {
            if (isPrismaNotFoundError(error)) {
                throw new NotFoundException(errorMessages.wallet.NOT_FOUND);
            }
            throw error;
        }
    }
}
