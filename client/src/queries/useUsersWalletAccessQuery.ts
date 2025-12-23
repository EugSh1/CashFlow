import type { User } from "@/types";
import { axiosInstance } from "@/utils/axiosInstance";
import { formatApiError } from "@/utils/formatApiError";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "sonner";

export function useUsersWalletAccessQuery(walletId: string) {
    const {
        data: usersWithWalletAccess,
        isLoading,
        isError,
        error
    } = useQuery({
        queryKey: [`users-${walletId}`],
        queryFn: async () =>
            await axiosInstance.get<User[]>(`/wallets/${walletId}/shared-with-users`),
        select: (response) => response.data
    });

    useEffect(() => {
        if (isError) {
            toast.error(formatApiError(error));
        }
    }, [isError, error]);

    return { usersWithWalletAccess, isLoading };
}
