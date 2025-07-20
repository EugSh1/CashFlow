import type { Transaction } from "@/types";
import axiosInstance from "@/utils/axiosInstance";
import { createMutateWithToast } from "@/utils/createMutateWithToast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useUpdateTransactionMutation(walletId: string, closeSheetFn: () => void) {
    const queryClient = useQueryClient();
    const { mutateAsync } = useMutation({
        mutationFn: async (transaction: Transaction) =>
            await axiosInstance.put<Transaction>(`/transactions/${transaction.id}`, transaction),
        onSuccess: () => {
            closeSheetFn();
            queryClient.invalidateQueries({ queryKey: [walletId] });
            queryClient.invalidateQueries({ queryKey: ["balance"] });
            queryClient.invalidateQueries({ queryKey: ["income"] });
            queryClient.invalidateQueries({ queryKey: ["expense"] });
        }
    });

    const mutateWithToast = createMutateWithToast(mutateAsync, {
        loading: "Updating transaction...",
        success: (data) => `Transaction \"${data.name}\" updated`
    });

    return { updateTransaction: mutateWithToast };
}
