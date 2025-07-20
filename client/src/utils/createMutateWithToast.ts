import { toast } from "sonner";
import { formatApiError } from "./formatApiError";

type StatusMessages<TResponse = void> =
    | {
          loading: string;
      } & (
          | {
                success: string;
            }
          | {
                success: (response: TResponse) => string;
            }
      );

export function createMutateWithToast<TArg, TResponse = void>(
    mutateAsync: (arg: TArg) => Promise<{ data: TResponse }>,
    statusMessages: StatusMessages<TResponse>
) {
    const { loading, success } = statusMessages;

    return (arg: TArg) => {
        toast.promise(mutateAsync(arg), {
            loading,
            success:
                typeof success === "function"
                    ? (response: { data: TResponse }) => success(response.data)
                    : success,
            error: (error) => formatApiError(error)
        });
    };
}
