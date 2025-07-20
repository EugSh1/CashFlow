import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { APP_GUARD } from "@nestjs/core";
import { WalletsModule } from "./wallets/wallets.module";
import { TransactionsModule } from "./transactions/transactions.module";
import { InvitesModule } from "./invites/invites.module";

@Module({
    imports: [
        AuthModule,
        UsersModule,
        ThrottlerModule.forRoot({
            throttlers: [{ ttl: 60000, limit: 100 }]
        }),
        WalletsModule,
        TransactionsModule,
        InvitesModule
    ],
    providers: [
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard
        }
    ]
})
export class AppModule {}
