import type { Invite } from "@/types";
import { axiosInstance } from "@/utils/axiosInstance";
import { createMutateWithToast } from "@/utils/createMutateWithToast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateInviteMutation(walletId: string) {
    const queryClient = useQueryClient();
    const { mutateAsync } = useMutation({
        mutationFn: async () =>
            await axiosInstance.post<Invite>("/invites", {}, { params: { walletId } }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`invites-${walletId}`] });
        }
    });

    const mutateWithToast = createMutateWithToast(mutateAsync, {
        loading: "Creating invite...",
        success: "Invite created"
    });

    return { createInvite: mutateWithToast };
}
