import type { paths } from "@/apiTypes";
import { axiosInstance } from "@/utils/axiosInstance";
import { createMutateWithToast } from "@/utils/createMutateWithToast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type Count =
    paths["/transactions/bulk-delete"]["post"]["responses"]["200"]["content"]["application/json"];

export function useBulkDeleteTransactionMutation(walletId: string) {
    const queryClient = useQueryClient();
    const { mutateAsync } = useMutation({
        mutationFn: async (transactionIds: string[]) =>
            await axiosInstance.post<Count>("/transactions/bulk-delete", {
                uuids: transactionIds
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [walletId] });
            queryClient.invalidateQueries({ queryKey: ["balance"] });
            queryClient.invalidateQueries({ queryKey: ["income"] });
            queryClient.invalidateQueries({ queryKey: ["expense"] });
        }
    });

    const mutateWithToast = createMutateWithToast(mutateAsync, {
        loading: "Deleting transactions...",
        success: (data) =>
            `${data.count} ${data.count === 1 ? "transaction" : "transactions"} deleted`
    });

    return { bulkDeleteTransactions: mutateWithToast };
}
