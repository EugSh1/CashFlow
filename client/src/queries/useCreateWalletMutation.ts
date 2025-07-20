import type { Wallet } from "@/types";
import axiosInstance from "@/utils/axiosInstance";
import { createMutateWithToast } from "@/utils/createMutateWithToast";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export default function useCreateWalletMutation() {
    const router = useRouter();
    const { mutateAsync } = useMutation({
        mutationFn: async (name: string) => await axiosInstance.post<Wallet>("/wallets", { name }),
        onSuccess: ({ data }) => {
            router.push(`/wallets/${data.id}`);
        }
    });

    const mutateWithToast = createMutateWithToast(mutateAsync, {
        loading: "Creating wallet...",
        success: (data) => `Wallet \"${data.name}\" created`
    });

    return { createWallet: mutateWithToast };
}
