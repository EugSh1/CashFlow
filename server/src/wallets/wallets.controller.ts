import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseUUIDPipe,
    Post,
    Put,
    Query,
    UseGuards
} from "@nestjs/common";
import { WalletsService } from "./wallets.service";
import { AuthGuard } from "src/common/guards/auth/auth.guard";
import { UserId } from "src/common/decorators/user-id/user-id.decorator";
import { CreateWalletDto } from "./dto/create-wallet.dto";
import { UpdateWalletDto } from "./dto/update-wallet.dto";
import { ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse } from "@nestjs/swagger";
import { WalletModel } from "./response-models/wallet.model";
import { WalletWithoutOwnerNameModel } from "./response-models/wallet-without-owner-name.model";
import { UserModel } from "src/users/response-models/user.model";

@Controller("wallets")
@UseGuards(AuthGuard)
export class WalletsController {
    constructor(private readonly walletsService: WalletsService) {}

    @Get()
    @ApiOkResponse({
        description: "Returns a list of wallets to which the authenticated user has access",
        type: [WalletModel]
    })
    async getWallets(@UserId() userId: string): Promise<WalletModel[]> {
        return await this.walletsService.getWallets(userId);
    }

    @Get(":id")
    @ApiOkResponse({
        description: "Returns the specific wallet by its ID, if the authenticated user has access",
        type: WalletModel
    })
    async getWallet(
        @Param("id", ParseUUIDPipe) walletId: string,
        @UserId() userId: string
    ): Promise<WalletModel> {
        return await this.walletsService.getWallet(walletId, userId);
    }

    @Get(":id/income")
    @ApiOkResponse({
        description: "Returns the current sum of income of the specified wallet",
        type: Number
    })
    async getWalletIncome(
        @Param("id", ParseUUIDPipe) walletId: string,
        @UserId() userId: string
    ): Promise<number> {
        return await this.walletsService.getWalletIncomeOrExpense(walletId, userId, "income");
    }

    @Get(":id/expense")
    @ApiOkResponse({
        description: "Returns the current sum of expenses of the specified wallet",
        type: Number
    })
    async getWalletExpense(
        @Param("id", ParseUUIDPipe) walletId: string,
        @UserId() userId: string
    ): Promise<number> {
        return await this.walletsService.getWalletIncomeOrExpense(walletId, userId, "expense");
    }

    @Get(":id/balance")
    @ApiOkResponse({
        description: "Returns the current balance of the specified wallet",
        type: Number
    })
    async getWalletBalance(
        @Param("id", ParseUUIDPipe) walletId: string,
        @UserId() userId: string
    ): Promise<number> {
        return await this.walletsService.getWalletBalance(walletId, userId);
    }

    @Post()
    @ApiCreatedResponse({
        description:
            "Creates a new wallet for the authenticated user and returns the created wallet (without the owner's name)",
        type: WalletWithoutOwnerNameModel
    })
    async createWallet(
        @Body() walletDto: CreateWalletDto,
        @UserId() userId: string
    ): Promise<WalletWithoutOwnerNameModel> {
        return await this.walletsService.createWallet(walletDto.name, userId);
    }

    @Put()
    @ApiOkResponse({
        description:
            "Changes the name of the specified wallet (if the authenticated user has access) and returns the updated wallet (without the owner's name)",
        type: WalletWithoutOwnerNameModel
    })
    async changeWalletName(
        @Body() walletDto: UpdateWalletDto,
        @UserId() userId: string
    ): Promise<WalletWithoutOwnerNameModel> {
        return await this.walletsService.changeWalletName(walletDto.id, userId, walletDto.name);
    }

    @Delete(":id")
    @ApiOkResponse({
        description:
            "Deletes the specified wallet (if the authenticated user has access) and returns the deleted wallet (without the owner's name)",
        type: WalletWithoutOwnerNameModel
    })
    async deleteWallet(
        @Param("id", ParseUUIDPipe) walletId: string,
        @UserId() userId: string
    ): Promise<WalletWithoutOwnerNameModel> {
        return await this.walletsService.deleteWallet(walletId, userId);
    }

    @Get(":id/shared-with-users")
    @ApiOkResponse({
        description:
            "Returns a list of users who have access to the wallet (if the authenticated user is owner)",
        type: [UserModel]
    })
    async getWalletAccessUsers(
        @Param("id", ParseUUIDPipe) walletId: string,
        @UserId() userId: string
    ): Promise<UserModel[]> {
        return await this.walletsService.getWalletAccessUsers(walletId, userId);
    }

    @Delete(":walletId/shared-with-users")
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiNoContentResponse({
        description:
            "Removes user access to the specified wallet (if the authenticated user is owner)"
    })
    async removeUserWalletAccess(
        @Param("walletId", ParseUUIDPipe) walletId: string,
        @Query("userId", ParseUUIDPipe) userIdToRemove: string,
        @UserId() userId: string
    ): Promise<void> {
        return await this.walletsService.removeUserWalletAccess(walletId, userIdToRemove, userId);
    }
}
