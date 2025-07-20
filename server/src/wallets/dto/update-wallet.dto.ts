import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsUUID, Length } from "class-validator";

export class UpdateWalletDto {
    @IsUUID()
    @ApiProperty()
    id: string;

    @IsString()
    @Length(2, 24)
    @ApiProperty({ minLength: 2, maxLength: 24 })
    name: string;
}
