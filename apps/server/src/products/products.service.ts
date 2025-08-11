import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Product } from "./products.model";
import { CreateProductDto } from "./products.dto";

@Injectable()
export class ProductService {
    constructor(
        @InjectModel(Product)
        private readonly productModel: typeof Product,
    ) {}

    async findAll(): Promise<Product[]> {
        return this.productModel.findAll();
    }

    async findOne(id: string): Promise<Product | null> {
        return this.productModel.findByPk(id);
    }

    async create(productData: CreateProductDto): Promise<Product> {
        try {
            if (!productData || !productData.name || !productData.price) {
                throw new Error("Name and price are required");
            }

            return this.productModel.create({
                name: productData.name,
                description: productData.description,
                price: productData.price,
                quantity: productData.quantity,
            });
        } catch (error) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "Unknown error occurred";
            throw new Error(`Error creating product: ${errorMessage}`);
        }
    }

    async update(
        id: string,
        productData: Partial<Product>,
    ): Promise<Product | null> {
        const product = await this.findOne(id);
        if (product) {
            return product.update(productData);
        }
        return null;
    }

    async delete(id: string): Promise<void> {
        const product = await this.findOne(id);
        if (product) {
            await product.destroy();
        }
    }
    async findByName(name: string): Promise<Product | null> {
        return this.productModel.findOne({
            where: { name },
        });
    }
}
