import type { Wallet } from "@/types";
import axiosInstance from "@/utils/axiosInstance";
import { formatApiError } from "@/utils/formatApiError";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "sonner";

export default function useWalletsQuery() {
    const {
        data: wallets,
        isLoading,
        isError,
        error
    } = useQuery({
        queryKey: ["wallets"],
        queryFn: async () => await axiosInstance.get<Wallet[]>("/wallets"),
        select: (response) => response.data
    });

    useEffect(() => {
        if (isError) {
            toast.error(formatApiError(error));
        }
    }, [isError, error]);

    return { wallets, isLoading };
}
