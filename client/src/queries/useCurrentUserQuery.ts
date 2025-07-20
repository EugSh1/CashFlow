import axiosInstance from "@/utils/axiosInstance";
import { formatApiError } from "@/utils/formatApiError";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "sonner";

export default function useCurrentUserQuery() {
    const {
        data: currentUser,
        isLoading,
        isError,
        error
    } = useQuery({
        queryKey: ["user"],
        queryFn: async () => await axiosInstance.get("/users/me"),
        select: (response) => response.data
    });

    useEffect(() => {
        if (isError) {
            toast.error(formatApiError(error));
        }
    }, [isError, error]);

    return { currentUser, isLoading };
}
