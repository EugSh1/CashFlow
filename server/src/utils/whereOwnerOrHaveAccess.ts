export function whereOwnerOrHaveAccess(userId: string) {
    return {
        OR: [
            { ownerId: userId },
            {
                usersHaveAccess: { some: { id: userId } }
            }
        ]
    };
}
