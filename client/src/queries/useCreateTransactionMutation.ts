import type { NewTransaction, Transaction } from "@/types";
import axiosInstance from "@/utils/axiosInstance";
import { createMutateWithToast } from "@/utils/createMutateWithToast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export default function useCreateTransactionMutation(walletId: string) {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { mutateAsync } = useMutation({
        mutationFn: async (transaction: NewTransaction) =>
            await axiosInstance.post<Transaction>(
                `/transactions?walletId=${walletId}`,
                transaction
            ),
        onSuccess: () => {
            router.push(`/wallets/${walletId}/transactions`);
            queryClient.invalidateQueries({ queryKey: [walletId] });
            queryClient.invalidateQueries({ queryKey: ["balance"] });
            queryClient.invalidateQueries({ queryKey: ["income"] });
            queryClient.invalidateQueries({ queryKey: ["expense"] });
        }
    });

    const mutateWithToast = createMutateWithToast(mutateAsync, {
        loading: "Creating transaction...",
        success: (data) => `Transaction \"${data.name}\" created`
    });

    return { createTransaction: mutateWithToast };
}
