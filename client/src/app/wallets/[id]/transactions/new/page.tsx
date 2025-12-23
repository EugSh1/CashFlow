"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { useCreateTransactionMutation } from "@/queries/useCreateTransactionMutation";
import type { NewTransaction } from "@/types";
import { useParams } from "next/navigation";
import { type FormEvent, useState } from "react";

const initialTransaction: NewTransaction = {
    name: "",
    amount: 0,
    type: "income"
};

export default function CreateTransactionPage() {
    const { id } = useParams<{ id: string }>();
    const [transaction, setTransaction] = useState<NewTransaction>(initialTransaction);
    const { createTransaction } = useCreateTransactionMutation(id);

    function handleCreateTransactionSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        createTransaction(transaction);
    }

    return (
        <main className="flex min-h-dvh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                <Card>
                    <CardHeader>
                        <CardTitle>Create transaction</CardTitle>
                        <CardDescription>
                            Fill in the details below to create a new transaction
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form
                            onSubmit={handleCreateTransactionSubmit}
                            className="flex flex-col gap-6"
                        >
                            <div className="grid gap-3">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    name="name"
                                    maxLength={64}
                                    placeholder="Transaction name (64 characters max)"
                                    required
                                    value={transaction.name}
                                    onChange={(event) =>
                                        setTransaction((prevTransaction) => ({
                                            ...prevTransaction,
                                            name: event.target.value
                                        }))
                                    }
                                />
                            </div>

                            <div className="grid gap-3">
                                <Label htmlFor="amount">Amount</Label>
                                <Input
                                    id="amount"
                                    type="number"
                                    inputMode="numeric"
                                    name="amount"
                                    min={0}
                                    placeholder="Transaction amount"
                                    required
                                    value={transaction.amount === 0 ? "" : transaction.amount}
                                    onChange={(event) =>
                                        setTransaction((prevTransaction) => ({
                                            ...prevTransaction,
                                            amount:
                                                event.target.value === ""
                                                    ? 0
                                                    : event.target.valueAsNumber
                                        }))
                                    }
                                />
                            </div>

                            <div className="grid gap-3">
                                <Label htmlFor="input-type">Type</Label>
                                <Select
                                    value={transaction?.type}
                                    onValueChange={(newValue) =>
                                        setTransaction((prevTransaction) => ({
                                            ...prevTransaction,
                                            type: newValue
                                        }))
                                    }
                                >
                                    <SelectTrigger id="input-type">
                                        <SelectValue placeholder="Select transaction type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="income">Income</SelectItem>
                                        <SelectItem value="expense">Expense</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button>Create</Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}
