import { ApiProperty } from "@nestjs/swagger";

export class WalletModel {
    @ApiProperty()
    id: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    ownerId: string;

    @ApiProperty()
    ownerName: string;
}
