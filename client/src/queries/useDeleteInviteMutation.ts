import type { Invite } from "@/types";
import { axiosInstance } from "@/utils/axiosInstance";
import { createMutateWithToast } from "@/utils/createMutateWithToast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteInviteMutation(walletId: string) {
    const queryClient = useQueryClient();
    const { mutateAsync } = useMutation({
        mutationFn: async (inviteId: string) =>
            await axiosInstance.delete<Invite>(`/invites/${inviteId}`, { params: { walletId } }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`invites-${walletId}`] });
        }
    });

    const mutateWithToast = createMutateWithToast(mutateAsync, {
        loading: "Deleting invite...",
        success: "Invite deleted"
    });

    return { deleteInvite: mutateWithToast };
}
