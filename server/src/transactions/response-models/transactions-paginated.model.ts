import { ApiProperty } from "@nestjs/swagger";
import { TransactionModel } from "./transaction.model";

export class TransactionsPaginatedModel {
    @ApiProperty({ type: [TransactionModel] })
    transactions: TransactionModel[];

    @ApiProperty()
    hasMore: boolean;

    @ApiProperty()
    nextPage: number;
}
