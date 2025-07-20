import { ApiProperty } from "@nestjs/swagger";

export class WalletWithoutOwnerNameModel {
    @ApiProperty()
    id: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    ownerId: string;
}
