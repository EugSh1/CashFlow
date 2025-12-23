"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAcceptInviteMutation } from "@/queries/useAcceptInviteMutation";
import { useParams } from "next/navigation";

export default function AcceptInvitePage() {
    const { id } = useParams<{ id: string }>();
    const { acceptInvite } = useAcceptInviteMutation(id);

    return (
        <main className="flex min-h-dvh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                <Card>
                    <CardHeader>
                        <CardTitle>Accept invite</CardTitle>
                        <CardDescription>
                            You are invited to a wallet. Press the button to accept invite.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button onClick={() => acceptInvite()}>Accept</Button>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}
