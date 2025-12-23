"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useChangePasswordMutation } from "@/queries/useChangePasswordMutation";
import { type FormEvent } from "react";

export default function ChangePasswordPage() {
    const { changePassword } = useChangePasswordMutation();
    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        changePassword({
            oldPassword: formData.get("old-password") as string,
            newPassword: formData.get("new-password") as string
        });
    }

    return (
        <div className="flex min-h-dvh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                <Card>
                    <CardHeader>
                        <CardTitle>Change password</CardTitle>
                        <CardDescription>Enter your old and new passwords below</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit}>
                            <div className="flex flex-col gap-6">
                                <div className="grid gap-3">
                                    <Label htmlFor="password">Old Password</Label>
                                    <Input
                                        id="old-password"
                                        type="password"
                                        name="old-password"
                                        placeholder="Old Password"
                                        required
                                        minLength={8}
                                    />
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="password">New Password</Label>
                                    <Input
                                        id="new-password"
                                        type="password"
                                        name="new-password"
                                        placeholder="New Password (8 characters min)"
                                        required
                                        minLength={8}
                                    />
                                </div>
                                <div className="flex flex-col gap-3">
                                    <Button type="submit" className="w-full">
                                        Change password
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
