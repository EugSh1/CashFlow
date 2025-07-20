import type { Wallet } from "@/types";
import axiosInstance from "@/utils/axiosInstance";
import { formatApiError } from "@/utils/formatApiError";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "sonner";

export default function useWalletQuery(walletId: string) {
    const {
        data: wallet,
        isLoading,
        isError,
        error
    } = useQuery({
        queryKey: [`wallet-${walletId}`],
        queryFn: async () => await axiosInstance.get<Wallet>(`/wallets/${walletId}`),
        select: (response) => response.data
    });

    useEffect(() => {
        if (isError) {
            toast.error(formatApiError(error));
        }
    }, [isError, error]);

    return { wallet, isLoading };
}
