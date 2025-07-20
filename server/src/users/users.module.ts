import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { PrismaModule } from "src/prisma/prisma.module";
import { JwtModule } from "@nestjs/jwt";

@Module({
    imports: [
        PrismaModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET
        })
    ],
    controllers: [UsersController],
    providers: [UsersService],
    exports: [UsersService, JwtModule]
})
export class UsersModule {}
