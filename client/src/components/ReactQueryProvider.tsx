"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode, useState } from "react";

type Props = {
    children: ReactNode;
};

export default function ReactQueryProvider({ children }: Readonly<Props>) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        retry: 2,
                        retryDelay: 250
                    }
                }
            })
    );

    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
