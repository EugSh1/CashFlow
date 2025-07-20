export const errorMessages = {
    wallet: {
        NOT_FOUND: "Wallet not found or you don't have access to it",
        NO_ACCESS: "You have no access to that wallet"
    },
    auth: {
        INVALID_CREDENTIALS: "Invalid credentials"
    },
    user: {
        NOT_FOUND: "User Not Found",
        NAME_OCCUPIED: "Name is already taken"
    },
    transaction: {
        NOT_FOUND: "Transaction not found or you don't have access to it"
    },
    invite: {
        NOT_FOUND: "Invite Not Found",
        EXPIRED: "Invite already expired",
        ALREADY_USED: "Invite already used",
        IS_OWNER: "You can't accept invite to a wallet you own",
        ALREADY_ACCEPTED: "You already have access to that wallet"
    }
} as const;
