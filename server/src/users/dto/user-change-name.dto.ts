import { ApiProperty } from "@nestjs/swagger";
import { IsString, MinLength } from "class-validator";

export class UserChangeNameDto {
    @IsString()
    @MinLength(2)
    @ApiProperty({ minLength: 2 })
    name: string;
}
