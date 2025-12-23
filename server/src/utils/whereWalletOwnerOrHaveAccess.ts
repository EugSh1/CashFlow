export function whereWalletOwnerOrHaveAccess(userId: string) {
    return {
        OR: [
            { wallet: { ownerId: userId } },
            {
                wallet: { usersHaveAccess: { some: { id: userId } } }
            }
        ]
    };
}
