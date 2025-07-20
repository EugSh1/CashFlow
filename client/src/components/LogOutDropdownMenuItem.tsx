"use client";

import useLogOutMutation from "@/queries/useLogOutMutation";
import { DropdownMenuItem } from "./ui/dropdown-menu";
import { LogOut } from "lucide-react";

export default function LogOutDropdownMenuItem() {
    const { logOut } = useLogOutMutation();
    return (
        <DropdownMenuItem onClick={() => logOut()} className="cursor-pointer">
            <LogOut className="text-foreground" />
            <span>Log out</span>
        </DropdownMenuItem>
    );
}
