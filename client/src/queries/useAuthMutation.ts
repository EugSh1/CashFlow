import { useMutation } from "@tanstack/react-query";
import type { paths } from "@/apiTypes";
import { createMutateWithToast } from "@/utils/createMutateWithToast";
import { axiosInstance } from "@/utils/axiosInstance";

type CreateUserFields = paths["/auth/login"]["post"]["requestBody"]["content"]["application/json"];

type Action = "register" | "login";
type ActionData = Record<
    Action,
    Record<"loadingMessage" | "successMessage" | "redirectPath", string>
>;

export function useAuthMutation(action: Action) {
    const actionData: ActionData = {
        register: {
            loadingMessage: "Creating an account...",
            successMessage: "Account created successfully",
            redirectPath: "/log-in"
        },
        login: {
            loadingMessage: "Logging in...",
            successMessage: "Logged in successfully",
            redirectPath: "/wallets"
        }
    };

    const { mutateAsync } = useMutation({
        mutationFn: async (data: CreateUserFields) =>
            await axiosInstance.post(`/auth/${action}`, data),
        onSuccess: () => {
            window.location.href = actionData[action].redirectPath;
        }
    });

    const mutateWithToast = createMutateWithToast(mutateAsync, {
        loading: actionData[action].loadingMessage,
        success: actionData[action].successMessage
    });

    return { mutateWithToast };
}
