import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import type { FormEvent } from "react";
import type { paths } from "@/apiTypes";

type CreateUserFields = paths["/auth/login"]["post"]["requestBody"]["content"]["application/json"];

type FormType = "register" | "login";

type Props = {
    type: FormType;
    onSubmitFn: (formData: CreateUserFields) => void;
};

type AuthFormContent = Record<
    FormType,
    Record<
        | "title"
        | "description"
        | "altOptionDesc"
        | "altOptionText"
        | "altOptionLink"
        | "buttonText",
        string
    >
>;

export default function AuthForm({ type, onSubmitFn }: Props) {
    const authFormContent: AuthFormContent = {
        register: {
            title: "Create an account",
            description: "Enter your name and a secure password below to create an account",
            altOptionDesc: "Already have an account?",
            altOptionText: "Log in",
            altOptionLink: "/log-in",
            buttonText: "Sign up"
        },
        login: {
            title: "Log in to your account",
            description: "Enter your name and password below to login to your account",
            altOptionDesc: "Don't have an account?",
            altOptionText: "Sign up",
            altOptionLink: "/register",
            buttonText: "Log in"
        }
    };

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        return onSubmitFn({
            name: (formData.get("name") as string | undefined) || "",
            password: (formData.get("password") as string | undefined) || ""
        });
    }

    return (
        <div className="flex min-h-dvh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                <Card>
                    <CardHeader>
                        <CardTitle>{authFormContent[type].title}</CardTitle>
                        <CardDescription>{authFormContent[type].description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit}>
                            <div className="flex flex-col gap-6">
                                <div className="grid gap-3">
                                    <Label htmlFor="email">Name</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        name="name"
                                        placeholder="Name (2 characters min)"
                                        required
                                        minLength={2}
                                    />
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="password">Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        name="password"
                                        placeholder="Password (8 characters min)"
                                        required
                                        minLength={8}
                                    />
                                </div>
                                <div className="flex flex-col gap-3">
                                    <Button type="submit" className="w-full">
                                        {authFormContent[type].buttonText}
                                    </Button>
                                </div>
                            </div>
                            <div className="mt-4 text-center text-sm">
                                {authFormContent[type].altOptionDesc}{" "}
                                <Link
                                    href={authFormContent[type].altOptionLink}
                                    className="underline underline-offset-4"
                                >
                                    {authFormContent[type].altOptionText}
                                </Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
