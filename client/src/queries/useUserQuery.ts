import type { User } from "@/types";
import axiosInstance from "@/utils/axiosInstance";
import { formatApiError } from "@/utils/formatApiError";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "sonner";

export default function useUserQuery() {
    const {
        data: user,
        isLoading,
        isError,
        error
    } = useQuery({
        queryKey: ["user"],
        queryFn: async () => await axiosInstance.get<User>("/users/me"),
        select: (response) => response.data
    });

    useEffect(() => {
        if (isError) {
            toast.error(formatApiError(error));
        }
    }, [isError, error]);

    return { user, isLoading };
}
