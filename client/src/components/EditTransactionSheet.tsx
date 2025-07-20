"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle
} from "@/components/ui/sheet";
import { type ChangeEvent, type ReactNode, useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import type { Transaction } from "@/types";

type Field = {
    labelText: string;
    inputId: string;
    Input: ReactNode;
};

type Props = {
    isOpen: boolean;
    initialTransaction: Transaction | null;
    onCloseFn: () => void;
    onSaveFn: (updatedTransaction: Transaction) => void;
};

export function EditTransactionSheet({ isOpen, initialTransaction, onCloseFn, onSaveFn }: Props) {
    const [transaction, setTransaction] = useState<Transaction | null>(initialTransaction);

    useEffect(() => {
        setTransaction(initialTransaction);
    }, [initialTransaction]);

    const fields: Field[] = [
        {
            labelText: "Name",
            inputId: "input-name",
            Input: (
                <Input
                    id="input-name"
                    value={transaction?.name}
                    onChange={(event: ChangeEvent<HTMLInputElement>) =>
                        setTransaction((prevTransaction) => ({
                            ...prevTransaction!,
                            name: event.target.value
                        }))
                    }
                />
            )
        },
        {
            labelText: "Amount",
            inputId: "input-amount",
            Input: (
                <Input
                    id="input-amount"
                    type="number"
                    value={isNaN(transaction?.amount ?? NaN) ? "" : transaction?.amount}
                    inputMode="numeric"
                    onChange={(event: ChangeEvent<HTMLInputElement>) =>
                        setTransaction((prevTransaction) => ({
                            ...prevTransaction!,
                            amount: event.target.valueAsNumber ?? 0
                        }))
                    }
                />
            )
        },
        {
            labelText: "Type",
            inputId: "input-type",
            Input: (
                <Select
                    value={transaction?.type}
                    onValueChange={(newValue) =>
                        setTransaction((prevTransaction) => ({
                            ...prevTransaction!,
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
            )
        }
    ];

    function handleSave() {
        if (!transaction) return;
        onSaveFn(transaction);
    }

    function handleOpenChange(isOpen: boolean) {
        if (!isOpen) {
            onCloseFn();
        }
    }

    return (
        <Sheet open={isOpen} onOpenChange={handleOpenChange}>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Edit transaction</SheetTitle>
                    <SheetDescription>
                        Make changes to that transaction here. Click save when you&apos;re done.
                    </SheetDescription>
                </SheetHeader>
                {transaction && (
                    <>
                        <div className="grid flex-1 auto-rows-min gap-6 px-4">
                            {fields.map(({ labelText, inputId, Input }) => (
                                <div className="grid gap-3" key={inputId}>
                                    <Label htmlFor={inputId}>{labelText}</Label>
                                    {Input}
                                </div>
                            ))}
                        </div>
                        <SheetFooter>
                            <Button type="submit" onClick={handleSave}>
                                Save changes
                            </Button>
                        </SheetFooter>
                    </>
                )}
            </SheetContent>
        </Sheet>
    );
}
