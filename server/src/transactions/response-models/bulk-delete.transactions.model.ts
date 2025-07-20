import { ApiProperty } from "@nestjs/swagger";

export class BulkDeleteTransactionsModel {
    @ApiProperty()
    count: number;
}
