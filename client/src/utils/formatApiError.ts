import { AxiosError } from "axios";

export function formatApiError(error: unknown): string {
    return error instanceof AxiosError && error.response
        ? Array.isArray(error.response.data.message)
            ? error.response.data.message.join(", ")
            : error.response.data.message
        : "Unknown error occured";
}
