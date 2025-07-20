import { ApiProperty } from "@nestjs/swagger";
import { IsString, MinLength } from "class-validator";

export class UserDto {
    @IsString()
    @MinLength(2)
    @ApiProperty({ minLength: 2 })
    name: string;

    @IsString()
    @MinLength(8)
    @ApiProperty({ minLength: 8 })
    password: string;
}
