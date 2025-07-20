import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNumber, IsPositive, IsString, MaxLength } from "class-validator";

enum ExpenseType {
    income = "income",
    expense = "expense"
}

export class TransactionDto {
    @IsString()
    @MaxLength(64)
    @ApiProperty({ maxLength: 64 })
    name: string;

    @IsNumber()
    @IsPositive()
    @ApiProperty({ minimum: 0 })
    amount: number;

    @IsEnum(ExpenseType)
    @ApiProperty({ enum: ["income", "expense"] })
    type: "income" | "expense";
}
