import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { Order } from "./order.model";
import { OrdersService } from "./orders.service";
import { OrdersController } from "./orders.controller";

@Module({
    imports: [SequelizeModule.forFeature([Order])],
    providers: [OrdersService],
    controllers: [OrdersController],
    exports: [OrdersService],
})
export class OrdersModule {}
