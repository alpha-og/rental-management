import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { Product } from "./products.model";
import { ProductService } from "./products.service";

@Module({
    imports: [SequelizeModule.forFeature([Product])],
    providers: [ProductService],
    exports: [ProductService],
})
export class ProductModule {}
