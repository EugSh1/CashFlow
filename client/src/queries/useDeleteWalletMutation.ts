import type { Wallet } from "@/types";
import { axiosInstance } from "@/utils/axiosInstance";
import { createMutateWithToast } from "@/utils/createMutateWithToast";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export function useDeleteWalletMutation(walletId: string) {
    const router = useRouter();
    const { mutateAsync } = useMutation({
        mutationFn: async () => await axiosInstance.delete<Wallet>(`/wallets/${walletId}`),
        onSuccess: () => {
            router.replace("/wallets");
        }
    });

    const mutateWithToast = createMutateWithToast(mutateAsync, {
        loading: "Deleting wallet...",
        success: (data) => `Wallet "${data.name}" deleted`
    });

    return { deleteWallet: mutateWithToast };
}
