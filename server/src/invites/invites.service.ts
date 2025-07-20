import { BadRequestException, GoneException, Injectable, NotFoundException } from "@nestjs/common";
import { errorMessages } from "src/constants/errorMessages";
import { PrismaService } from "src/prisma/prisma.service";
import { isPrismaNotFoundError } from "src/utils/isPrismaNotFoundError";

@Injectable()
export class InvitesService {
    constructor(private prismaService: PrismaService) {}

    async getInvites(walletId: string, userId: string) {
        const foundWallet = await this.prismaService.wallet.findUnique({
            where: { id: walletId, ownerId: userId }
        });

        if (!foundWallet) {
            throw new NotFoundException(errorMessages.wallet.NOT_FOUND);
        }

        return await this.prismaService.invite.findMany({
            where: { walletId },
            orderBy: { createdAt: "desc" }
        });
    }

    async createInvite(walletId: string, userId: string) {
        const foundWallet = await this.prismaService.wallet.findUnique({
            where: { id: walletId, ownerId: userId }
        });

        if (!foundWallet) {
            throw new NotFoundException(errorMessages.wallet.NOT_FOUND);
        }

        const weekAfterDate = new Date(new Date().setDate(new Date().getDate() + 7)); // 7 days expiration time

        return this.prismaService.invite.create({
            data: {
                expiresAt: weekAfterDate,
                walletId
            }
        });
    }

    async acceptInvite(inviteId: string, userId: string) {
        try {
            const foundInvite = await this.prismaService.invite.findUnique({
                where: { id: inviteId }
            });

            if (!foundInvite) {
                throw new NotFoundException(errorMessages.invite.NOT_FOUND);
            }

            if (new Date() > foundInvite.expiresAt) {
                throw new GoneException(errorMessages.invite.EXPIRED);
            }

            if (foundInvite.used) {
                throw new GoneException(errorMessages.invite.ALREADY_USED);
            }

            const foundWallet = await this.prismaService.wallet.findUnique({
                where: { id: foundInvite.walletId },
                include: { usersHaveAccess: true }
            });

            if (!foundWallet) {
                throw new NotFoundException(errorMessages.wallet.NOT_FOUND);
            }

            if (foundWallet.ownerId === userId) {
                throw new BadRequestException(errorMessages.invite.IS_OWNER);
            }

            if (foundWallet.usersHaveAccess.find((user) => user.id === userId)) {
                throw new BadRequestException(errorMessages.invite.ALREADY_ACCEPTED);
            }

            const invite = await this.prismaService.invite.update({
                where: { id: inviteId },
                data: { used: true }
            });

            await this.prismaService.wallet.update({
                where: { id: foundInvite.walletId },
                data: { usersHaveAccess: { connect: { id: userId } } }
            });

            return invite;
        } catch (error) {
            if (isPrismaNotFoundError(error)) {
                throw new NotFoundException(errorMessages.wallet.NOT_FOUND);
            }
            throw error;
        }
    }

    async deleteInvite(inviteId: string, walletId: string, userId: string) {
        const foundWallet = await this.prismaService.wallet.findUnique({
            where: { id: walletId, ownerId: userId }
        });

        if (!foundWallet) {
            throw new NotFoundException(errorMessages.wallet.NOT_FOUND);
        }
        try {
            return await this.prismaService.invite.delete({ where: { id: inviteId } });
        } catch (error) {
            if (isPrismaNotFoundError(error)) {
                throw new NotFoundException(errorMessages.invite.NOT_FOUND);
            }
            throw error;
        }
    }
}
