import WalletSidebar from "@/components/WalletSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import type { ReactNode } from "react";

type Props = {
    params: Promise<{ id: string }>;
    children: ReactNode;
};

export default async function Layout({ params, children }: Props) {
    const { id } = await params;

    return (
        <SidebarProvider>
            <WalletSidebar walletId={id} />
            <main className="w-full">
                <SidebarTrigger className="cursor-pointer fixed z-50" />
                {children}
            </main>
        </SidebarProvider>
    );
}
