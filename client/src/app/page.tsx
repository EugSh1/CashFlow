import { FeatureCard } from "@/components/FeatureCard";
import { Button } from "@/components/ui/button";
import type { Feature } from "@/types";
import { DollarSign, LayoutDashboard, TrendingUp, Trash2, Wallet, Users } from "lucide-react";
import Link from "next/link";

const features: Feature[] = [
    {
        title: "Easy to Use Interface",
        description: "Intuitive and user-friendly design for effortless tracking.",
        Icon: LayoutDashboard
    },
    {
        title: "Income & Expense Tracking",
        description: "Track both income and expenses.",
        Icon: TrendingUp
    },
    {
        title: "Wallet Management",
        description: "Create and manage multiple wallets for different purposes.",
        Icon: Wallet
    },
    {
        title: "Collaborative Wallets",
        description: "Share wallets via invite and manage collaborators easily.",
        Icon: DollarSign
    },
    {
        title: "Bulk Transaction Management",
        description: "Select and delete multiple transactions at once for efficient management.",
        Icon: Trash2
    },
    {
        title: "Profile Customization",
        description:
            "Easily update your username and password to keep your account secure and personal.",
        Icon: Users
    }
];

export default function Home() {
    return (
        <main className="flex flex-col gap-2.5">
            <section className="flex flex-col gap-1 justify-center items-center min-h-svh">
                <h1 className="text-7xl font-bold">CashFlow</h1>
                <p className="text-muted-foreground text-center mx-2 md:max-w-2/3 lg:max-w-1/2">
                    Track your spending effortlessly with our easy-to-use expense tracker. Manage
                    budgets, monitor expenses, and save smarter every day!
                </p>
                <div className="flex gap-1.5">
                    <Button asChild>
                        <Link href="/wallets">Get Started</Link>
                    </Button>
                    <Button variant="secondary" asChild>
                        <Link href="#features">Learn More</Link>
                    </Button>
                </div>
            </section>

            <section className="flex flex-col gap-1 justify-center items-center">
                <h2 className="text-4xl font-bold" id="features">
                    Everything You Need
                </h2>
                <p className="text-muted-foreground text-center mx-2 md:max-w-2/3 lg:max-w-1/2 mb-5">
                    Discover powerful features designed to help you take control of your finances
                    and make smarter financial decisions.
                </p>
                <div className="grid grid-cols-3 gap-2 mx-2">
                    {features.map((feature) => (
                        <FeatureCard key={feature.title} feature={feature} />
                    ))}
                </div>
            </section>

            <section className="flex flex-col gap-1 justify-center items-center my-16">
                <h2 className="text-4xl font-bold">Start tracking your expenses today</h2>
                <p className="text-muted-foreground text-center mx-2 md:max-w-2/3 lg:max-w-1/2">
                    Take control of your finances and start your journey to better financial
                    management today.
                </p>
                <Button asChild>
                    <Link href="/wallets">Get Started</Link>
                </Button>
            </section>
        </main>
    );
}
