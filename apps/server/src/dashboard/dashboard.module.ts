import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { DashboardController } from "./dashboard.controller";
import { DashboardService } from "./dashboard.service";
import { Order } from "../orders/order.model";
import { Quotation } from "../quotations/quotation.model";
import { Product } from "../products/products.model";
import { User } from "../user/user.model";
import { JwtModule } from "@nestjs/jwt";

@Module({
    imports: [
        SequelizeModule.forFeature([Order, Quotation, Product, User]),
        JwtModule,
    ],
    controllers: [DashboardController],
    providers: [DashboardService],
})
export class DashboardModule {}
