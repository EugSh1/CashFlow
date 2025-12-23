"use client";

import { useState, memo, useCallback } from "react";
import type { Transaction } from "@/types";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Badge } from "./ui/badge";
import { expenseFormatter } from "@/utils/expenseFormatter";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "./ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { cn } from "@/utils/cn";
import { createPortal } from "react-dom";
import { useDeleteTransactionMutation } from "@/queries/useDeleteTransactionMutation";
import { useBulkDeleteTransactionMutation } from "@/queries/useBulkDeleteTransactionsMutation";

type Props = {
    data: Transaction[];
    walletId: string;
    editTransactionFn: (transaction: Transaction) => void;
};

const ActionsButton = memo(
    ({
        transaction,
        editTransactionFn,
        walletId
    }: {
        transaction: Transaction;
        editTransactionFn: (transaction: Transaction) => void;
        walletId: string;
    }) => {
        const { deleteTransaction } = useDeleteTransactionMutation(walletId);

        function handleDeleteTransaction() {
            deleteTransaction(transaction.id);
        }

        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0 float-right">
                        <MoreHorizontal className="h-4 w-4" aria-label="Open menu" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>{transaction.name}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => editTransactionFn(transaction)}>
                        Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleDeleteTransaction}>Delete</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        );
    }
);

const TransactionRow = memo(
    ({
        transaction,
        walletId,
        isSelected,
        toggleSelectTransactionFn,
        editTransactionFn
    }: {
        transaction: Transaction;
        walletId: string;
        isSelected: boolean;
        toggleSelectTransactionFn: (transactionId: string) => void;
        editTransactionFn: (transaction: Transaction) => void;
    }) => {
        const { id, name, amount, type, createdAt } = transaction;

        const formattedExpense = expenseFormatter.format(amount);
        const createdAtDate = new Date(createdAt);

        function handleSelectTransaction() {
            toggleSelectTransactionFn(id);
        }

        return (
            <TableRow className={cn(isSelected && "bg-accent/80")}>
                <TableCell>
                    <Checkbox
                        checked={isSelected}
                        onCheckedChange={handleSelectTransaction}
                        aria-label="Select row"
                    />
                </TableCell>
                <TableCell className="font-medium">{name}</TableCell>
                <TableCell>{formattedExpense}</TableCell>
                <TableCell>
                    <Badge
                        className="w-16"
                        variant={type === "expense" ? "destructive" : "default"}
                    >
                        {type}
                    </Badge>
                </TableCell>
                <TableCell>
                    <Tooltip>
                        <TooltipTrigger>{createdAtDate.toDateString()}</TooltipTrigger>
                        <TooltipContent>{createdAtDate.toTimeString()}</TooltipContent>
                    </Tooltip>
                </TableCell>
                <TableCell>
                    <ActionsButton
                        transaction={transaction}
                        walletId={walletId}
                        editTransactionFn={editTransactionFn}
                    />
                </TableCell>
            </TableRow>
        );
    }
);

export function TransactionsTable({ data, walletId, editTransactionFn }: Readonly<Props>) {
    const { bulkDeleteTransactions } = useBulkDeleteTransactionMutation(walletId);
    const [selectedTransactionIds, setSelectedTransactionIds] = useState<string[]>([]);

    function clearSelection() {
        setSelectedTransactionIds([]);
    }

    function handleDeleteTransactions() {
        bulkDeleteTransactions(selectedTransactionIds);
        clearSelection();
    }

    const toggleTransactionSelection = useCallback((transactionId: string) => {
        setSelectedTransactionIds((prevTransactionIds) =>
            prevTransactionIds.includes(transactionId)
                ? prevTransactionIds.filter((id) => id !== transactionId)
                : [...prevTransactionIds, transactionId]
        );
    }, []);

    return (
        <div className="border border-border rounded-md">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead></TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Created at</TableHead>
                        <TableHead></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((transaction) => (
                        <TransactionRow
                            key={transaction.id}
                            transaction={transaction}
                            walletId={walletId}
                            isSelected={selectedTransactionIds.includes(transaction.id)}
                            toggleSelectTransactionFn={toggleTransactionSelection}
                            editTransactionFn={editTransactionFn}
                        />
                    ))}
                </TableBody>
            </Table>

            {selectedTransactionIds.length
                ? createPortal(
                      <div className="fixed bottom-0 bg-secondary/70 border border-border/70 p-2 backdrop-blur-[2px] w-full flex justify-center items-center gap-1.5">
                          <p>
                              {selectedTransactionIds.length}{" "}
                              {selectedTransactionIds.length === 1 ? "row" : "rows"} selected
                          </p>
                          <Button variant="secondary" onClick={clearSelection}>
                              Deselect
                          </Button>
                          <Button variant="destructive" onClick={handleDeleteTransactions}>
                              Delete
                          </Button>
                      </div>,
                      document.body
                  )
                : null}
        </div>
    );
}
