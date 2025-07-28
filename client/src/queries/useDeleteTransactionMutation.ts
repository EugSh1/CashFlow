import type { paths } from "@/apiTypes";
import axiosInstance from "@/utils/axiosInstance";
import { createMutateWithToast } from "@/utils/createMutateWithToast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type Transaction =
    paths["/transactions/{transactionId}"]["delete"]["responses"]["200"]["content"]["application/json"];

export default function useDeleteTransactionMutation(walletId: string) {
    const queryClient = useQueryClient();
    const { mutateAsync } = useMutation({
        mutationFn: async (transactionId: string) =>
            await axiosInstance.delete<Transaction>(`/transactions/${transactionId}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [walletId] });
            queryClient.invalidateQueries({ queryKey: ["balance"] });
            queryClient.invalidateQueries({ queryKey: ["income"] });
            queryClient.invalidateQueries({ queryKey: ["expense"] });
        }
    });

    const mutateWithToast = createMutateWithToast(mutateAsync, {
        loading: "Deleting transaction...",
        success: (data) => `Transaction "${data.name}" deleted`
    });

    return { deleteTransaction: mutateWithToast };
}
