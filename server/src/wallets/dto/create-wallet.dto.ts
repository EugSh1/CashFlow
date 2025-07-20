import { ApiProperty } from "@nestjs/swagger";
import { IsString, Length } from "class-validator";

export class CreateWalletDto {
    @IsString()
    @Length(2, 24)
    @ApiProperty({ minLength: 2, maxLength: 24 })
    name: string;
}
