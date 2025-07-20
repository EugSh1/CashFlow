"use client";

import AuthForm from "@/components/AuthForm";
import useAuthMutation from "@/queries/useAuthMutation";

export default function RegisterPage() {
    const { mutateWithToast: mutateRegister } = useAuthMutation("register");

    return <AuthForm type="register" onSubmitFn={mutateRegister} />;
}
