"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useCreateWalletMutation from "@/queries/useCreateWalletMutation";
import { type FormEvent, useState } from "react";

export default function CreateWalletPage() {
    const [name, setName] = useState<string>("");
    const { createWallet } = useCreateWalletMutation();

    function handleCreateWalletSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        createWallet(name);
    }

    return (
        <main className="flex min-h-dvh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                <Card>
                    <CardHeader>
                        <CardTitle>Create wallet</CardTitle>
                        <CardDescription>
                            Fill in the details below to create a new wallet
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleCreateWalletSubmit} className="flex flex-col gap-6">
                            <div className="grid gap-3">
                                <Label htmlFor="name">Wallet name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    name="name"
                                    minLength={2}
                                    maxLength={24}
                                    placeholder="Wallet name (2-24 characters)"
                                    required
                                    value={name}
                                    onChange={(event) => setName(event.target.value)}
                                />
                            </div>
                            <Button>Create</Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}
