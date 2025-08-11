import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { Order } from "./order.model";
import { OrdersService } from "./orders.service";
import { OrdersController } from "./orders.controller";
import { Quotation } from "../quotations/quotation.model";
import { Product } from "../products/products.model";

@Module({
    imports: [SequelizeModule.forFeature([Order, Quotation, Product])],
    providers: [OrdersService],
    controllers: [OrdersController],
    exports: [OrdersService],
})
export class OrdersModule {}
