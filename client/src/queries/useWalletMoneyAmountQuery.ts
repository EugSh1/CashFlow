import type { MoneyAmountResponse } from "@/types";
import axiosInstance from "@/utils/axiosInstance";
import { formatApiError } from "@/utils/formatApiError";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "sonner";

type QueryType = "income" | "balance" | "expense";

export default function useWalletBalanceQuery(walletId: string, type: QueryType) {
    const {
        data: amount,
        isLoading,
        isError,
        error
    } = useQuery({
        queryKey: [type],
        queryFn: async () =>
            await axiosInstance.get<MoneyAmountResponse>(`/wallets/${walletId}/${type}`),
        select: (response) => response.data
    });

    useEffect(() => {
        if (isError) {
            toast.error(formatApiError(error));
        }
    }, [isError, error]);

    return { amount, isLoading };
}
