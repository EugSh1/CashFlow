import type { Invite } from "@/types";
import { axiosInstance } from "@/utils/axiosInstance";
import { formatApiError } from "@/utils/formatApiError";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "sonner";

export function useInvitesQuery(walletId: string) {
    const {
        data: invites,
        isLoading,
        isError,
        error
    } = useQuery({
        queryKey: [`invites-${walletId}`],
        queryFn: async () => await axiosInstance.get<Invite[]>("invites", { params: { walletId } }),
        select: (response) => response.data
    });

    useEffect(() => {
        if (isError) {
            toast.error(formatApiError(error));
        }
    }, [isError, error]);

    return { invites, isLoading };
}
