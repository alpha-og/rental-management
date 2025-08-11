import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
} from "@nestjs/common";
import { ProductService } from "./products.service";
import { Product } from "./products.model";
import { CreateProductDto } from "./products.dto";

@Controller("products")
export class ProductsController {
    constructor(private readonly productsService: ProductService) {}

    @Post()
    async createProduct(
        @Body() productData: CreateProductDto,
    ): Promise<Product> {
        return this.productsService.create(productData);
    }

    @Get()
    async getAllProducts(): Promise<Product[]> {
        return this.productsService.findAll();
    }

    @Get(":id")
    async getProductById(@Param("id") id: string): Promise<Product | null> {
        return this.productsService.findOne(id);
    }

    @Put(":id")
    async updateProduct(
        @Param("id") id: string,
        @Body() productData: Partial<Product>,
    ): Promise<Product | null> {
        return this.productsService.update(id, productData);
    }

    @Delete(":id")
    async deleteProduct(@Param("id") id: string): Promise<void> {
        return this.productsService.delete(id);
    }
}
