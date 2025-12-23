"use client";

import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { User2 } from "lucide-react";
import { useWalletsQuery } from "@/queries/useWalletsQuery";
import { BlockLoader } from "@/components/BlockLoader";
import { FloatingCreateButton } from "@/components/FloatingCreateButton";
import type { Wallet } from "@/types";

export default function WalletsPage() {
    const { wallets, isLoading } = useWalletsQuery();

    return (
        <main className="mx-2 mt-2">
            <div className="flex justify-between">
                <h1 className="font-semibold text-2xl">Wallets you have access to</h1>

                <Button variant="secondary" asChild>
                    <Link href="/profile">
                        <User2 />
                        Profile
                    </Link>
                </Button>
            </div>
            {isLoading ? <BlockLoader /> : <WalletsList wallets={wallets} />}

            <FloatingCreateButton tooltipText="Create wallet" type="link" href="/wallets/new" />
        </main>
    );
}

function WalletsList({ wallets }: Readonly<{ wallets: Wallet[] | undefined }>) {
    return wallets?.length ? (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mb-2">
            {wallets?.map(({ id, name, ownerName }) => (
                <Link href={`/wallets/${id}`} className="w-full" key={id}>
                    <Card className="aspect-wallet w-full rounded-md p-3 flex flex-col">
                        <h2 className="text-lg">{name}</h2>
                        <p className="mt-auto text-muted-foreground">{ownerName}</p>
                    </Card>
                </Link>
            ))}
        </div>
    ) : (
        <p className="text-muted-foreground">You don&apos;t have access to any wallets</p>
    );
}
