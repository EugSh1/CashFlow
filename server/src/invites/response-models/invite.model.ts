import { ApiProperty } from "@nestjs/swagger";

export class InviteModel {
    @ApiProperty()
    id: string;

    @ApiProperty()
    walletId: string;

    @ApiProperty()
    expiresAt: Date;

    @ApiProperty()
    used: boolean;

    @ApiProperty()
    createdAt: Date;
}
