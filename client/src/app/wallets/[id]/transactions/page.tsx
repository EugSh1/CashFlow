"use client";

import BlockLoader from "@/components/BlockLoader";
import { EditTransactionSheet } from "@/components/EditTransactionSheet";
import FloatingCreateButton from "@/components/FloatingCreateButton";
import InfoCards from "@/components/HomeInfoCard";
import TransactionsTable from "@/components/TransactionsTable";
import { Button } from "@/components/ui/button";
import useTransactionsQuery from "@/queries/useTransactionsQuery";
import useUpdateTransactionMutation from "@/queries/useUpdateTransactionMutation";
import useWalletBalanceQuery from "@/queries/useWalletMoneyAmountQuery";
import type { Transaction } from "@/types";
import { useParams } from "next/navigation";
import { useCallback, useState } from "react";

export default function TransactionsPage() {
    const { id } = useParams<{ id: string }>();
    const { amount: balance } = useWalletBalanceQuery(id, "balance");
    const { amount: income } = useWalletBalanceQuery(id, "income");
    const { amount: expense } = useWalletBalanceQuery(id, "expense");
    const { updateTransaction } = useUpdateTransactionMutation(id, () =>
        setSelectedTransaction(null)
    );
    const { data, fetchNextPage, isLoading, isFetching, hasNextPage, isFetchingNextPage } =
        useTransactionsQuery(id);
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

    function handleSaveTransaction(transaction: Transaction) {
        updateTransaction(transaction);
    }

    const editTransactionFn = useCallback((transaction: Transaction) => {
        setSelectedTransaction(transaction);
    }, []);

    return (
        <main className="mx-2">
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-2 my-2">
                <InfoCards
                    title="Balance"
                    amount={balance ?? 0}
                    description="Wallet balance"
                    percents={0}
                    lowerInfo=""
                    trends="up"
                    showTrends={false}
                />

                <InfoCards
                    title="Total Income"
                    amount={income ?? 0}
                    description="Total wallet income"
                    percents={0}
                    lowerInfo=""
                    trends="up"
                    showTrends={false}
                />

                <InfoCards
                    className="col-span-1 md:col-span-2 xl:col-span-1"
                    title="Total Expenses"
                    amount={expense ?? 0}
                    description="Total wallet expense"
                    percents={0}
                    lowerInfo=""
                    trends="up"
                    showTrends={false}
                />
            </div>

            <EditTransactionSheet
                isOpen={!!selectedTransaction}
                onCloseFn={() => setSelectedTransaction(null)}
                onSaveFn={handleSaveTransaction}
                initialTransaction={selectedTransaction}
            />

            {isLoading ? (
                <BlockLoader />
            ) : (
                <TransactionsTable
                    data={data?.pages.flatMap((page) => page.transactions) ?? []}
                    walletId={id}
                    editTransactionFn={editTransactionFn}
                />
            )}

            {hasNextPage ? (
                <div className="h-24 flex justify-center items-center">
                    <Button
                        variant="secondary"
                        onClick={() => fetchNextPage()}
                        disabled={isFetching}
                    >
                        {isFetchingNextPage ? "Loading more..." : "Load more"}
                    </Button>
                </div>
            ) : (
                <p className="text-muted-foreground h-20 flex justify-center items-center">
                    No more transactions
                </p>
            )}

            <FloatingCreateButton
                tooltipText="Create transaction"
                type="link"
                href={`/wallets/${id}/transactions/new`}
            />
        </main>
    );
}
