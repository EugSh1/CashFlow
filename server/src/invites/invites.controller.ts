import {
    Controller,
    Delete,
    Get,
    Param,
    ParseUUIDPipe,
    Post,
    Query,
    UseGuards
} from "@nestjs/common";
import { InvitesService } from "./invites.service";
import { UserId } from "src/common/decorators/user-id/user-id.decorator";
import { InviteModel } from "./response-models/invite.model";
import { ApiCreatedResponse, ApiOkResponse } from "@nestjs/swagger";
import { AuthGuard } from "src/common/guards/auth/auth.guard";

@Controller("invites")
@UseGuards(AuthGuard)
export class InvitesController {
    constructor(private invitesService: InvitesService) {}

    @Get()
    @ApiOkResponse({
        description: "Get all invites for a specific wallet",
        type: [InviteModel]
    })
    async getInvites(
        @Query("walletId", ParseUUIDPipe) walletId: string,
        @UserId() userId: string
    ): Promise<InviteModel[]> {
        return await this.invitesService.getInvites(walletId, userId);
    }

    @Post()
    @ApiCreatedResponse({
        description: "Create a new invite for a wallet",
        type: InviteModel
    })
    async createInvite(
        @Query("walletId", ParseUUIDPipe) walletId: string,
        @UserId() userId: string
    ): Promise<InviteModel> {
        return await this.invitesService.createInvite(walletId, userId);
    }

    @Post("accept/:inviteId")
    @ApiOkResponse({
        description: "Accept an invite to join a wallet",
        type: InviteModel
    })
    async acceptInvite(
        @Param("inviteId", ParseUUIDPipe) inviteId: string,
        @UserId() userId: string
    ): Promise<InviteModel> {
        return await this.invitesService.acceptInvite(inviteId, userId);
    }

    @Delete(":inviteId")
    @ApiOkResponse({
        description: "Delete a wallet invite",
        type: InviteModel
    })
    async deleteInvite(
        @Param("inviteId", ParseUUIDPipe) inviteId: string,
        @Query("walletId", ParseUUIDPipe) walletId: string,
        @UserId() userId: string
    ): Promise<InviteModel> {
        return await this.invitesService.deleteInvite(inviteId, walletId, userId);
    }
}
