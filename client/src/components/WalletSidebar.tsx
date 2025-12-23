import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem
} from "@/components/ui/sidebar";
import {
    ChevronDown,
    ChevronUp,
    LayoutDashboard,
    Plus,
    TableProperties,
    Trash2,
    User2,
    UserPlus,
    WalletIcon,
    type LucideIcon
} from "lucide-react";
import Link from "next/link";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from "./ui/dropdown-menu";
import { cookies } from "next/headers";
import type { User, Wallet } from "@/types";
import { redirect } from "next/navigation";
import Avatar from "boring-avatars";
import { avatarColors } from "@/constants";
import { axiosInstance } from "@/utils/axiosInstance";
import { LogOutDropdownMenuItem } from "./LogOutDropdownMenuItem";

type MenuItem = {
    title: string;
    url: string;
    Icon: LucideIcon;
};

type Props = {
    walletId: string;
};

const publicMenuItems: MenuItem[] = [
    {
        title: "Overview",
        url: "/",
        Icon: LayoutDashboard
    },
    {
        title: "Transactions",
        url: "/transactions",
        Icon: TableProperties
    }
];

const ownerMenuItems: MenuItem[] = [
    {
        title: "Collaborators",
        url: "/collaborators",
        Icon: UserPlus
    },
    {
        title: "Delete",
        url: "/delete",
        Icon: Trash2
    }
];

export async function WalletSidebar({ walletId }: Readonly<Props>) {
    const cookieStore = cookies();
    const token = (await cookieStore).get("token")?.value;
    const tokenCookieHeader = { headers: { Cookie: `token=${token}` } };

    const { data: wallets } = await axiosInstance.get<Wallet[]>("/wallets", tokenCookieHeader);

    let currentWallet: Wallet;
    try {
        const { data: wallet } = await axiosInstance.get<Wallet>(
            `/wallets/${walletId}`,
            tokenCookieHeader
        );
        currentWallet = wallet;
    } catch {
        redirect("/not-found");
    }
    const { data: currentUser } = await axiosInstance.get<User>("/users/me", tokenCookieHeader);

    const menuItems =
        currentWallet.ownerId === currentUser.id
            ? [...publicMenuItems, ...ownerMenuItems]
            : [...publicMenuItems];

    return (
        <Sidebar>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild className="cursor-pointer">
                                <SidebarMenuButton className="select-none">
                                    {currentWallet.name}
                                    <ChevronDown className="ml-auto" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-60">
                                {wallets.map(({ id, name }) => (
                                    <DropdownMenuItem key={id} asChild className="cursor-pointer">
                                        <Link href={`/wallets/${id}`}>{name}</Link>
                                    </DropdownMenuItem>
                                ))}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild className="cursor-pointer">
                                    <Link href="/wallets">
                                        <WalletIcon className="text-foreground" />
                                        All wallets
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild className="cursor-pointer">
                                    <Link href="/wallets/new">
                                        <Plus className="text-foreground" />
                                        Create wallet
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarMenu>
                        <SidebarGroupContent>
                            {menuItems.map(({ title, url, Icon }) => (
                                <SidebarMenuItem key={title}>
                                    <SidebarMenuButton asChild>
                                        <Link href={`/wallets/${walletId}${url}`}>
                                            <Icon />
                                            <span className="select-none">{title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarGroupContent>
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild className="cursor-pointer">
                                <SidebarMenuButton>
                                    <div className="flex items-center gap-3">
                                        <Avatar
                                            name={currentUser.name}
                                            variant="beam"
                                            className="w-5 aspect-square"
                                            colors={avatarColors}
                                        />
                                        <span>{currentUser.name}</span>
                                    </div>
                                    <ChevronUp className="ml-auto" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent side="top" className="w-60">
                                <DropdownMenuItem asChild className="cursor-pointer">
                                    <Link href="/profile">
                                        <User2 className="text-foreground" />
                                        Profile
                                    </Link>
                                </DropdownMenuItem>
                                <LogOutDropdownMenuItem />
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}
