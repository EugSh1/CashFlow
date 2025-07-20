import axiosInstance from "@/utils/axiosInstance";
import { createMutateWithToast } from "@/utils/createMutateWithToast";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export default function useLogOutMutation() {
    const router = useRouter();
    const { mutateAsync } = useMutation({
        mutationFn: async () => await axiosInstance.post("/auth/logout"),
        onSuccess: () => {
            router.replace("/");
        }
    });

    const mutateWithToast = createMutateWithToast(mutateAsync, {
        loading: "Logging out...",
        success: "Logged out successfully"
    });

    return { logOut: mutateWithToast };
}
