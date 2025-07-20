import type { paths } from "@/apiTypes";
import axiosInstance from "@/utils/axiosInstance";
import { formatApiError } from "@/utils/formatApiError";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "sonner";

type TransactionsResponse =
    paths["/transactions"]["get"]["responses"]["200"]["content"]["application/json"];

export default function useTransactionsQuery(walletId: string) {
    const {
        data,
        isFetching,
        isLoading,
        isError,
        error,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage
    } = useInfiniteQuery({
        queryKey: [walletId],
        initialPageParam: 1,
        getNextPageParam: (lastPage) => (lastPage.nextPage === -1 ? undefined : lastPage.nextPage),
        queryFn: async ({ pageParam }: { pageParam: number }) => {
            const response = await axiosInstance.get<TransactionsResponse>("/transactions", {
                params: { walletId, page: pageParam }
            });
            return response.data;
        }
    });

    useEffect(() => {
        if (isError) {
            toast.error(formatApiError(error));
        }
    }, [isError, error]);

    return { data, isFetching, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage };
}
