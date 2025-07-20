import { ApiProperty } from "@nestjs/swagger";

export class TransactionModel {
    @ApiProperty()
    id: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    amount: number;

    @ApiProperty()
    type: "income" | "expense";

    @ApiProperty()
    walletId: string;

    @ApiProperty()
    createdAt: Date;
}
