"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDeleteWalletMutation } from "@/queries/useDeleteWalletMutation";
import { useWalletQuery } from "@/queries/useWalletQuery";
import { useParams } from "next/navigation";
import { type FormEvent, useState } from "react";

export default function DeleteWalletPage() {
    const { id } = useParams<{ id: string }>();
    const { wallet, isLoading } = useWalletQuery(id);
    const { deleteWallet } = useDeleteWalletMutation(id);
    const [confirmationName, setConfirmationName] = useState<string>("");

    function handleDeleteWalletSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        deleteWallet();
    }

    const walletDisplayName = isLoading ? "Loading..." : wallet?.name;

    return (
        <main className="flex min-h-dvh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                <Card>
                    <CardHeader>
                        <CardTitle>Delete wallet &quot;{walletDisplayName}&quot;</CardTitle>
                        <CardDescription>
                            To confirm deletion, type &quot;{walletDisplayName}&quot; in the box
                            below
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleDeleteWalletSubmit} className="flex flex-col gap-6">
                            <div className="grid gap-3">
                                <Label htmlFor="name">Wallet name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    name="name"
                                    minLength={2}
                                    maxLength={24}
                                    placeholder={`Type "${walletDisplayName}" here`}
                                    required
                                    value={confirmationName}
                                    onChange={(event) => setConfirmationName(event.target.value)}
                                />
                            </div>
                            <Button disabled={wallet?.name !== confirmationName}>Delete</Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}
