import { Module } from "@nestjs/common";
import { PrismaModule } from "src/prisma/prisma.module";
import { InvitesService } from "./invites.service";
import { InvitesController } from "./invites.controller";

@Module({
    imports: [PrismaModule],
    controllers: [InvitesController],
    providers: [InvitesService]
})
export class InvitesModule {}
