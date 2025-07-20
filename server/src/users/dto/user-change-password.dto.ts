import { ApiProperty } from "@nestjs/swagger";
import { IsString, MinLength } from "class-validator";

export class UserChangePasswordDto {
    @IsString()
    @MinLength(8)
    @ApiProperty({ minLength: 8 })
    oldPassword: string;

    @IsString()
    @MinLength(8)
    @ApiProperty({ minLength: 8 })
    newPassword: string;
}
