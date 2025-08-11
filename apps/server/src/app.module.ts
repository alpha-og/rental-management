import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { SequelizeModule } from "@nestjs/sequelize";
import { UserModule } from "./user/user.module";
import { AuthModule } from "./auth/auth.module";
import { APP_GUARD } from "@nestjs/core";
import { AuthGuard } from "./auth/auth.guard";
import { ProductModule } from "./products/products.module";
import { ContractsModule } from "./contracts/contracts.module";
import { RatesModule } from "./rates/rates.module";
import { ReservationsModule } from "./reservations/reservations.module";
import { OrdersModule } from "./orders/orders.module";
import { AttachmentsModule } from "./attachments/attachments.module";
import { QuotationsModule } from "./quotations/quotations.module";
import { AssociationsModule } from "./associations/associations.module";

@Module({
    imports: [
        SequelizeModule.forRoot({
            dialect: "postgres",
            host: process.env.POSTGRES_HOST,
            username: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DB,
            autoLoadModels: true,
            synchronize: true,
            // synchronize: process.env.NODE_ENV !== "production",
        }),
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath:
                process.env.NODE_ENV === "production"
                    ? ".env.production"
                    : ".env.development",
        }),
        AssociationsModule,
        UserModule,
        AuthModule,
        ProductModule,
        ContractsModule,
        RatesModule,
        ReservationsModule,
        OrdersModule,
        AttachmentsModule,
        QuotationsModule,
    ],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: APP_GUARD,
            useClass: AuthGuard,
        },
    ],
})
export class AppModule {}
