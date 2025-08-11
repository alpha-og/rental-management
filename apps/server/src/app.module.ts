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
import { MulterModule } from "@nestjs/platform-express";
import { AppwriteService } from "./config/appwrite.config";

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
        }),
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath:
                process.env.NODE_ENV === "production"
                    ? ".env.prod"
                    : ".env.dev",
        }),
        MulterModule.register({
            limits: {
                fileSize: 5 * 1024 * 1024, // 5MB
            },
            fileFilter: (req, file, cb) => {
                if (!file.mimetype.startsWith("image/")) {
                    return cb(new Error("Only image files are allowed"), false);
                }
                cb(null, true);
            },
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
        AppwriteService,
    ],
})
export class AppModule {}
