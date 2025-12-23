"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useChangeNameMutation } from "@/queries/useChangeNameMutation";
import { type FormEvent } from "react";

export default function ChangeNamePage() {
    const { changeName } = useChangeNameMutation();
    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        changeName(formData.get("name") as string);
    }

    return (
        <div className="flex min-h-dvh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                <Card>
                    <CardHeader>
                        <CardTitle>Change name</CardTitle>
                        <CardDescription>Enter your new username below</CardDescription>
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
                                <div className="flex flex-col gap-3">
                                    <Button type="submit" className="w-full">
                                        Change name
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
