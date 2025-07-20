import { Test, TestingModule } from "@nestjs/testing";
import { InvitesService } from "./invites.service";
import { PrismaModule } from "src/prisma/prisma.module";
import { createTestInvite, createTestUser, createTestWallet, truncateAllTables } from "test/utils";
import { errorMessages } from "src/constants/errorMessages";
import { PrismaService } from "src/prisma/prisma.service";
import whereOwnerOrHaveAccess from "src/utils/whereOwnerOrHaveAccess";

describe("InvitesService", () => {
    let invitesService: InvitesService;
    let prismaService: PrismaService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [PrismaModule],
            providers: [InvitesService]
        }).compile();

        invitesService = module.get<InvitesService>(InvitesService);
        prismaService = module.get<PrismaService>(PrismaService);

        await truncateAllTables();
    });

    describe(".getInvites", () => {
        it("should get invites correctly", async () => {
            const { id: userId } = await createTestUser();
            const { id: walletId } = await createTestWallet(userId);
            const invite1 = await createTestInvite(walletId, { expired: false, used: false });
            const invite2 = await createTestInvite(walletId, { expired: false, used: false });

            expect(await invitesService.getInvites(walletId, userId)).toStrictEqual([
                invite2,
                invite1
            ]);
        });

        it("should throw an error if trying to get invites for a wallet in which user is not an owner", async () => {
            const { id: userId1 } = await createTestUser();
            const { id: userId2 } = await createTestUser();
            const { id: walletId } = await createTestWallet(userId2);
            await createTestInvite(walletId, { expired: true, used: false });
            await createTestInvite(walletId, { expired: false, used: false });

            await expect(invitesService.getInvites(walletId, userId1)).rejects.toThrow(
                errorMessages.wallet.NOT_FOUND
            );
        });

        it("should throw an error if trying to get invites for a non-existent wallet", async () => {
            const { id: userId } = await createTestUser();

            await expect(
                invitesService.getInvites("non-existent-wallet-id", userId)
            ).rejects.toThrow(errorMessages.wallet.NOT_FOUND);
        });
    });

    describe(".createInvite", () => {
        it("should create an invite correctly", async () => {
            const { id: userId } = await createTestUser();
            const { id: walletId } = await createTestWallet(userId);

            const createdInvite = await invitesService.createInvite(walletId, userId);

            expect(createdInvite.id).not.toBeUndefined();
            expect(createdInvite.walletId).not.toBeUndefined();
            expect(createdInvite.expiresAt).not.toBeUndefined();
            expect(createdInvite.used).toBe(false);
            expect(createdInvite.createdAt).not.toBeUndefined();

            const invites = await prismaService.invite.findMany({ where: { walletId } });

            expect(invites.length).toBe(1);
        });

        it("should throw an error if trying to create an invite to a wallet in which user is not an owner", async () => {
            const { id: userId1 } = await createTestUser();
            const { id: userId2 } = await createTestUser();
            const { id: walletId } = await createTestWallet(userId2);

            await expect(invitesService.createInvite(walletId, userId1)).rejects.toThrow(
                errorMessages.wallet.NOT_FOUND
            );
        });

        it("should throw an error if trying to create an invite to a non-existent wallet", async () => {
            const { id: userId } = await createTestUser();

            await expect(
                invitesService.createInvite("non-existent-wallet-id", userId)
            ).rejects.toThrow(errorMessages.wallet.NOT_FOUND);
        });
    });

    describe(".acceptInvite", () => {
        it("should accept an invite correctly", async () => {
            const { id: ownerId } = await createTestUser();
            const { id: userId } = await createTestUser();
            const { id: walletId } = await createTestWallet(ownerId);

            const { id: inviteId } = await createTestInvite(walletId, {
                used: false,
                expired: false
            });

            await invitesService.acceptInvite(inviteId, userId);

            const checkIfUserHaveAccessToWallet = !!(await prismaService.wallet.findUnique({
                where: {
                    id: walletId,
                    ...whereOwnerOrHaveAccess(userId)
                }
            }));

            expect(checkIfUserHaveAccessToWallet).toBe(true);
        });

        it("should throw an error if trying to accept non-existent invite", async () => {
            const { id: userId } = await createTestUser();

            await expect(
                invitesService.acceptInvite("non-existent-invite-id", userId)
            ).rejects.toThrow(errorMessages.invite.NOT_FOUND);
        });

        it("should throw an error if trying to accept already used invite", async () => {
            const { id: ownerId } = await createTestUser();
            const { id: userId1 } = await createTestUser();
            const { id: userId2 } = await createTestUser();
            const { id: walletId } = await createTestWallet(ownerId);

            const { id: inviteId } = await createTestInvite(walletId, {
                used: false,
                expired: false
            });

            await invitesService.acceptInvite(inviteId, userId1);

            await expect(invitesService.acceptInvite(inviteId, userId2)).rejects.toThrow(
                errorMessages.invite.ALREADY_USED
            );
        });

        it("should throw an error if trying to accept already expired invite", async () => {
            const { id: ownerId } = await createTestUser();
            const { id: userId } = await createTestUser();
            const { id: walletId } = await createTestWallet(ownerId);

            const { id: inviteId } = await createTestInvite(walletId, {
                used: false,
                expired: true
            });

            await expect(invitesService.acceptInvite(inviteId, userId)).rejects.toThrow(
                errorMessages.invite.EXPIRED
            );
        });

        it("should throw an error if trying to accept invite when user already has access to a wallet", async () => {
            const { id: ownerId } = await createTestUser();
            const { id: userId } = await createTestUser();
            const { id: walletId } = await createTestWallet(ownerId);

            const { id: inviteId1 } = await createTestInvite(walletId, {
                used: false,
                expired: false
            });

            await invitesService.acceptInvite(inviteId1, userId);

            const { id: inviteId2 } = await createTestInvite(walletId, {
                used: false,
                expired: false
            });

            await expect(invitesService.acceptInvite(inviteId2, userId)).rejects.toThrow(
                errorMessages.invite.ALREADY_ACCEPTED
            );
        });

        it("should throw an error if trying to accept invite as a wallet owner", async () => {
            const { id: ownerId } = await createTestUser();
            const { id: walletId } = await createTestWallet(ownerId);

            const { id: inviteId } = await createTestInvite(walletId, {
                used: false,
                expired: false
            });

            await expect(invitesService.acceptInvite(inviteId, ownerId)).rejects.toThrow(
                errorMessages.invite.IS_OWNER
            );
        });
    });

    describe(".deleteInvite", () => {
        it("should delete an invite correctly", async () => {
            const { id: userId } = await createTestUser();
            const { id: walletId } = await createTestWallet(userId);
            const { id: inviteIdToDelete } = await createTestInvite(walletId, {
                used: false,
                expired: false
            });

            await invitesService.deleteInvite(inviteIdToDelete, walletId, userId);

            const invites = await prismaService.invite.findMany({ where: { walletId } });

            expect(invites.length).toBe(0);
        });

        it("should throw an error if trying to delete an invite to a wallet in which user is not an owner", async () => {
            const { id: userId1 } = await createTestUser();
            const { id: userId2 } = await createTestUser();
            const { id: walletId } = await createTestWallet(userId2);
            const { id: inviteIdToDelete } = await createTestInvite(walletId, {
                used: false,
                expired: false
            });

            await expect(
                invitesService.deleteInvite(inviteIdToDelete, walletId, userId1)
            ).rejects.toThrow(errorMessages.wallet.NOT_FOUND);
        });

        it("should throw an error if trying to delete a non-existent-invite", async () => {
            const { id: userId } = await createTestUser();
            const { id: walletId } = await createTestWallet(userId);

            await expect(
                invitesService.deleteInvite("non-existent-invite-id", walletId, userId)
            ).rejects.toThrow(errorMessages.invite.NOT_FOUND);
        });
    });
});
