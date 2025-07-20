import axiosInstance from "@/utils/axiosInstance";
import { cookies } from "next/headers";
import Link from "next/link";
import type { Wallet } from "@/types";

type Props = {
    params: Promise<{ id: string }>;
};

export default async function OverviewPage({ params }: Props) {
    const { id } = await params;

    const cookieStore = cookies();
    const token = (await cookieStore).get("token")?.value;
    const tokenCookieHeader = { headers: { Cookie: `token=${token}` } };

    const { data: currentWallet } = await axiosInstance.get<Wallet>(
        `/wallets/${id}`,
        tokenCookieHeader
    );

    return (
        <main className="flex flex-col gap-1.5 justify-center items-center h-[100dvh]">
            <h1 className="text-5xl font-semibold">{currentWallet.name}</h1>
            <Link href={`/wallets/${id}/transactions`} className="text-primary underline">
                Manage Transactions
            </Link>
            {/* here add balance card */}
        </main>
    );
}
