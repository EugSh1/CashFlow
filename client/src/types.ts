import type { paths } from "./apiTypes";
import type { LucideIcon } from "lucide-react";

export type Transaction =
    paths["/transactions"]["get"]["responses"]["200"]["content"]["application/json"]["transactions"][number];

export type NewTransaction = Omit<Transaction, "id" | "walletId" | "createdAt">;

export type Wallet =
    paths["/wallets"]["get"]["responses"][200]["content"]["application/json"][number];

export type User = paths["/users/me"]["get"]["responses"][200]["content"]["application/json"];

export type Feature = {
    title: string;
    description: string;
    Icon: LucideIcon;
};

export type MoneyAmountResponse =
    paths["/wallets/{id}/balance"]["get"]["responses"]["200"]["content"]["application/json"];

export type Invite =
    paths["/invites"]["get"]["responses"]["200"]["content"]["application/json"][number];
