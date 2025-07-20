import axiosInstance from "@/utils/axiosInstance";
import { createMutateWithToast } from "@/utils/createMutateWithToast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export default function useChangeNameMutation() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { mutateAsync } = useMutation({
        mutationFn: async (name: string) => await axiosInstance.put("/users/name", { name }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["user"] });
            router.replace("/profile");
        }
    });

    const mutateWithToast = createMutateWithToast(mutateAsync, {
        loading: "Updating name...",
        success: "Name updated"
    });

    return { changeName: mutateWithToast };
}
