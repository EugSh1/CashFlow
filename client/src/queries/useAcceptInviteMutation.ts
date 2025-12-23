import type { Invite } from "@/types";
import { axiosInstance } from "@/utils/axiosInstance";
import { createMutateWithToast } from "@/utils/createMutateWithToast";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export function useAcceptInviteMutation(inviteId: string) {
    const router = useRouter();
    const { mutateAsync } = useMutation({
        mutationFn: async () => await axiosInstance.post<Invite>(`/invites/accept/${inviteId}`),
        onSuccess: ({ data }) => {
            router.replace(`/wallets/${data.walletId}`);
        }
    });

    const mutateWithToast = createMutateWithToast(mutateAsync, {
        loading: "Accepting invite...",
        success: "Invite accepted"
    });

    return { acceptInvite: mutateWithToast };
}
