"use client";

import { AuthForm } from "@/components/AuthForm";
import { useAuthMutation } from "@/queries/useAuthMutation";

export default function LogInPage() {
    const { mutateWithToast: mutateLogIn } = useAuthMutation("login");

    return <AuthForm type="login" onSubmitFn={mutateLogIn} />;
}
