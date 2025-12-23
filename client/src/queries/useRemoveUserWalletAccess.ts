import type { Invite } from "@/types";
import { axiosInstance } from "@/utils/axiosInstance";
import { createMutateWithToast } from "@/utils/createMutateWithToast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useRemoveUserWalletAccess(walletId: string) {
    const queryClient = useQueryClient();
    const { mutateAsync } = useMutation({
        mutationFn: async (userId: string) =>
            await axiosInstance.delete<Invite>(`/wallets/${walletId}/shared-with-users`, {
                params: { userId }
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`users-${walletId}`] });
        }
    });

    const mutateWithToast = createMutateWithToast(mutateAsync, {
        loading: "Removing collaborator...",
        success: "Collaborator removed"
    });

    return { removeCollaborator: mutateWithToast };
}
