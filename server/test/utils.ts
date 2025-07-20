import * as bcrypt from "bcrypt";
import { randomUUID } from "crypto";
import { PrismaClient, Transaction, Wallet } from "generated/prisma";

const prisma = new PrismaClient();

export async function truncateAllTables() {
    await prisma.$executeRawUnsafe(`
        TRUNCATE TABLE "Invite", "Transaction", "Wallet", "User" RESTART IDENTITY CASCADE;
    `);
}

export async function createTestUser() {
    return await prisma.user.create({
        data: { name: `test-user-${randomUUID()}`, password: randomUUID() }
    });
}

export async function createTestUserWithHashedPassword() {
    const initialPassword = randomUUID();
    const hashedPassword = await bcrypt.hash(initialPassword, 10);
    const user = await prisma.user.create({
        data: { name: `test-user-${randomUUID()}`, password: hashedPassword }
    });

    return { user, initialPassword };
}

export async function createTestWallets(ownerId: string) {
    const testWallets: Omit<Wallet, "id">[] = new Array(5).fill(0).map(() => ({
        name: `test-wallet-${randomUUID()}`,
        ownerId
    }));

    return await prisma.wallet.createManyAndReturn({
        data: testWallets
    });
}

export async function createTestWallet(ownerId: string) {
    return await prisma.wallet.create({
        data: {
            name: `test-wallet-${randomUUID()}`,
            ownerId
        }
    });
}

export async function createTestTransactions(walletId: string, amount: number = 5) {
    const testTransactions: Omit<Transaction, "id" | "createdAt">[] = new Array(amount)
        .fill(0)
        .map(() => ({
            name: `test-wallet-${randomUUID()}`,
            walletId,
            amount: Math.floor(Math.random() * 1000),
            type: Math.random() > 0.5 ? "income" : "expense"
        }));

    return await prisma.transaction.createManyAndReturn({
        data: testTransactions
    });
}

export async function createTestInvite(
    walletId: string,
    options: { used: boolean; expired: boolean }
) {
    const expiresAt = options.expired
        ? new Date(new Date().setDate(new Date().getDate() - 1)) // expired one day ago
        : new Date(new Date().setDate(new Date().getDate() + 7)); // 7 days expiration time

    return prisma.invite.create({
        data: {
            expiresAt,
            walletId,
            used: options.used
        }
    });
}
