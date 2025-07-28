import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseIntPipe,
    ParseUUIDPipe,
    Post,
    Put,
    Query,
    UseGuards
} from "@nestjs/common";
import { TransactionsService } from "./transactions.service";
import { AuthGuard } from "src/common/guards/auth/auth.guard";
import { UserId } from "src/common/decorators/user-id/user-id.decorator";
import { TransactionDto } from "./dto/create-transaction.dto";
import { ApiCreatedResponse, ApiOkResponse } from "@nestjs/swagger";
import { TransactionModel } from "./response-models/transaction.model";
import { TransactionsPaginatedModel } from "./response-models/transactions-paginated.model";
import { BulkDeleteTransactionsDto } from "./dto/bulk-delete-transactions.dto";
import { BulkDeleteTransactionsModel } from "./response-models/bulk-delete.transactions.model";

@Controller("transactions")
@UseGuards(AuthGuard)
export class TransactionsController {
    constructor(private readonly transactionsService: TransactionsService) {}

    @Get()
    @ApiOkResponse({
        description:
            "Returns a paginated list of transactions for the specified wallet to which the authenticated user has access",
        type: TransactionsPaginatedModel
    })
    async getTransactions(
        @Query("walletId", ParseUUIDPipe) walletId: string,
        @Query("page", ParseIntPipe) page: number,
        @UserId() userId: string
    ): Promise<TransactionsPaginatedModel> {
        return await this.transactionsService.getTransactionsPaginated(walletId, userId, page);
    }

    @Post()
    @ApiCreatedResponse({
        description:
            "Creates a new transaction in the specified wallet (if the authenticated user has access) and returns the created transaction",
        type: TransactionModel
    })
    async createTransaction(
        @Query("walletId", ParseUUIDPipe) walletId: string,
        @Body() transactionDto: TransactionDto,
        @UserId() userId: string
    ): Promise<TransactionModel> {
        return await this.transactionsService.createTransaction(walletId, userId, transactionDto);
    }

    @Put(":transactionId")
    @ApiOkResponse({
        description:
            "Updates the specified transaction (if the authenticated user has access) and returns the updated transaction",
        type: TransactionModel
    })
    async updateTransaction(
        @Param("transactionId", ParseUUIDPipe) transactionId: string,
        @Body() transactionDto: TransactionDto,
        @UserId() userId: string
    ): Promise<TransactionModel> {
        return await this.transactionsService.updateTransaction(
            transactionId,
            userId,
            transactionDto
        );
    }

    @Delete(":transactionId")
    @ApiOkResponse({
        description:
            "Deletes the specified transaction (if the authenticated user has access) and returns the deleted transaction",
        type: TransactionModel
    })
    async deleteTransaction(
        @Param("transactionId", ParseUUIDPipe) transactionId: string,
        @UserId() userId: string
    ): Promise<TransactionModel> {
        return await this.transactionsService.deleteTransaction(transactionId, userId);
    }

    @Post("bulk-delete")
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        description:
            "Deletes multiple transactions specified by their UUIDs (if the authenticated user has access) and returns the counter of deleted transactions",
        type: BulkDeleteTransactionsModel
    })
    async bulkDeleteTransactions(
        @Body() bulkDeleteTransactionsDto: BulkDeleteTransactionsDto,
        @UserId() userId: string
    ): Promise<BulkDeleteTransactionsModel> {
        return await this.transactionsService.deleteMultipleTransactions(
            bulkDeleteTransactionsDto.uuids,
            userId
        );
    }
}
