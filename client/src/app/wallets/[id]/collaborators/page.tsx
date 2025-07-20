"use client";

import FloatingCreateButton from "@/components/FloatingCreateButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import useCreateInviteMutation from "@/queries/useCreateInviteMutation";
import useDeleteInviteMutation from "@/queries/useDeleteInviteMutation";
import useInvitesQuery from "@/queries/useInvitesQuery";
import useRemoveUserWalletAccess from "@/queries/useRemoveUserWalletAccess";
import useUsersWalletAccessQuery from "@/queries/useUsersWalletAccessQuery";
import { cn } from "@/utils/cn";
import { Trash2 } from "lucide-react";
import { useParams } from "next/navigation";
import Avatar from "boring-avatars";
import { avatarColors } from "@/constants";
import BlockLoader from "@/components/BlockLoader";

export default function CollaboratorsPage() {
    const { id } = useParams<{ id: string }>();
    const { invites, isLoading: isInvitesLoading } = useInvitesQuery(id);
    const { usersWithWalletAccess, isLoading: isUsersLoading } = useUsersWalletAccessQuery(id);
    const { createInvite } = useCreateInviteMutation(id);
    const { deleteInvite } = useDeleteInviteMutation(id);
    const { removeCollaborator } = useRemoveUserWalletAccess(id);

    return (
        <main className="mx-2 mt-2">
            <h3 className="font-semibold text-lg">Collaborators</h3>
            <p className="text-muted-foreground">
                You can view collaborators and remove access to wallet from a collaborator here.
            </p>
            {isUsersLoading ? (
                <BlockLoader />
            ) : (
                <>
                    {usersWithWalletAccess?.length ? (
                        <div className="border border-border rounded-md">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>User</TableHead>
                                        <TableHead></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {usersWithWalletAccess?.map(({ id, name }) => (
                                        <TableRow key={id}>
                                            <TableCell className="flex items-center gap-3">
                                                <Avatar
                                                    name={name}
                                                    variant="beam"
                                                    className="w-9 aspect-square"
                                                    colors={avatarColors}
                                                />
                                                <span>{name}</span>
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    className="float-right"
                                                    variant="ghost"
                                                    aria-label={`Remove collaborator ${name}`}
                                                    onClick={() => removeCollaborator(id)}
                                                >
                                                    <Trash2 />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    ) : (
                        <p>No collaborators yet</p>
                    )}
                </>
            )}

            <h3 className="font-semibold text-lg">Invites</h3>
            <p className="text-muted-foreground">
                Invites expire after 7 days and can be used only once.
            </p>
            {isInvitesLoading ? (
                <BlockLoader />
            ) : (
                <>
                    {invites?.length ? (
                        <div className="border border-border rounded-md">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Id</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Created at</TableHead>
                                        <TableHead>Expires at</TableHead>
                                        <TableHead></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {invites?.map(({ id, used, expiresAt, createdAt }) => {
                                        const expiresAtDate = new Date(expiresAt);
                                        const createdAtDate = new Date(createdAt);
                                        const nowDate = new Date();
                                        const isExpired = expiresAtDate < nowDate;
                                        const isInvalid = used || isExpired;
                                        const inviteUrl = `${window.location.origin}/invite/${id}`;

                                        return (
                                            <TableRow
                                                key={id}
                                                className={cn(isInvalid && "bg-muted/40")}
                                            >
                                                <TableCell>{inviteUrl}</TableCell>
                                                <TableCell>
                                                    <Badge
                                                        className="w-16"
                                                        variant={
                                                            isInvalid ? "secondary" : "default"
                                                        }
                                                    >
                                                        {isExpired
                                                            ? "Expired"
                                                            : used
                                                            ? "Used"
                                                            : "Active"}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Tooltip>
                                                        <TooltipTrigger>
                                                            {createdAtDate.toDateString()}
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            {createdAtDate.toTimeString()}
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TableCell>
                                                <TableCell>
                                                    <Tooltip>
                                                        <TooltipTrigger>
                                                            {expiresAtDate.toDateString()}
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            {expiresAtDate.toTimeString()}
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TableCell>
                                                <TableCell>
                                                    <Button
                                                        className="float-right"
                                                        variant="ghost"
                                                        aria-label={`Delete invite ${id}`}
                                                        onClick={() => deleteInvite(id)}
                                                    >
                                                        <Trash2 />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    ) : (
                        <p>No invites yet</p>
                    )}
                </>
            )}

            <FloatingCreateButton
                tooltipText="Create invite"
                type="button"
                onClick={createInvite}
            />
        </main>
    );
}
