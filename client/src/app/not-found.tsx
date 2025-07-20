import Link from "next/link";

export default function NotFoundPage() {
    return (
        <main className="flex flex-col gap-1 justify-center items-center h-svh">
            <h2 className="text-5xl font-bold">Page Not Found</h2>
            <div className="font-medium">
                <Link href={"/"} className="text-primary underline">
                    Home
                </Link>{" "}
                |{" "}
                <Link href={"/wallets"} className="text-primary underline">
                    All Wallets
                </Link>
            </div>
        </main>
    );
}
