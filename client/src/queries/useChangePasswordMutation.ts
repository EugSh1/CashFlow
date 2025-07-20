import axiosInstance from "@/utils/axiosInstance";
import { createMutateWithToast } from "@/utils/createMutateWithToast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export default function useChangePasswordMutation() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { mutateAsync } = useMutation({
        mutationFn: async (passwords: { oldPassword: string; newPassword: string }) =>
            await axiosInstance.put("/users/password", passwords),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["user"] });
            router.replace("/profile");
        }
    });

    const mutateWithToast = createMutateWithToast(mutateAsync, {
        loading: "Updating password...",
        success: "Password updated"
    });

    return { changePassword: mutateWithToast };
}
