"use client";

import { FullPageLoader } from "@/components/FullPageLoader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { avatarColors } from "@/constants";
import { useLogOutMutation } from "@/queries/useLogOutMutation";
import { useUserQuery } from "@/queries/useUserQuery";
import Avatar from "boring-avatars";
import Link from "next/link";

export default function ProfilePage() {
    const { user, isLoading } = useUserQuery();
    const { logOut } = useLogOutMutation();

    return isLoading ? (
        <FullPageLoader />
    ) : (
        <div className="flex min-h-dvh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                <Card>
                    <CardContent className="flex flex-col gap-3.5">
                        <div className="flex flex-col items-center">
                            <Avatar
                                name={user?.name}
                                variant="beam"
                                className="w-16 aspect-square"
                                colors={avatarColors}
                            />
                            <h3 className="font-semibold text-2xl">{user?.name}</h3>
                            <p className="text-muted-foreground text-sm">Your account</p>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <Button asChild variant="secondary">
                                <Link href="/profile/change-name">Change name</Link>
                            </Button>
                            <Button asChild variant="secondary">
                                <Link href="/profile/change-password">Change password</Link>
                            </Button>
                            <hr />
                            <Button variant="secondary" onClick={() => logOut()}>
                                Log Out
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
