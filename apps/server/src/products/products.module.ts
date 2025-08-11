import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { Product } from "./products.model";
import { ProductService } from "./products.service";
import { ProductsController } from "./products.controller";

@Module({
    imports: [SequelizeModule.forFeature([Product])],
    controllers: [ProductsController],
    providers: [ProductService],
    exports: [ProductService],
})
export class ProductModule {}
