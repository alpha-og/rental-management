import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    HttpStatus,
} from "@nestjs/common";
import { ProductService } from "./products.service";
import { Product } from "./products.model";
import { CreateProductDto, UpdateProductDto } from "./products.dto";
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBody,
    ApiBearerAuth,
} from "@nestjs/swagger";

@ApiTags("products")
@ApiBearerAuth()
@Controller("products")
export class ProductsController {
    constructor(private readonly productsService: ProductService) {}

    @Post()
    @ApiOperation({ summary: "Create a new product" })
    @ApiBody({ type: CreateProductDto })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: "The product has been successfully created.",
        type: Product,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: "Bad request.",
    })
    async createProduct(
        @Body() productData: CreateProductDto,
    ): Promise<Product> {
        return this.productsService.create(productData);
    }

    @Get()
    @ApiOperation({ summary: "Get all products" })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Return all products.",
        type: [Product],
    })
    async getAllProducts(): Promise<Product[]> {
        return this.productsService.findAll();
    }

    @Get(":id")
    @ApiOperation({ summary: "Get a product by id" })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Return the product.",
        type: Product,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: "Product not found.",
    })
    async getProductById(@Param("id") id: string): Promise<Product | null> {
        return this.productsService.findOne(id);
    }

    @Put(":id")
    @ApiOperation({ summary: "Update a product" })
    @ApiBody({ type: UpdateProductDto })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "The product has been successfully updated.",
        type: Product,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: "Product not found.",
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: "Bad request.",
    })
    async updateProduct(
        @Param("id") id: string,
        @Body() productData: UpdateProductDto,
    ): Promise<Product | null> {
        return this.productsService.update(id, productData);
    }

    @Delete(":id")
    @ApiOperation({ summary: "Delete a product" })
    @ApiResponse({
        status: HttpStatus.NO_CONTENT,
        description: "The product has been successfully deleted.",
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: "Product not found.",
    })
    async deleteProduct(@Param("id") id: string): Promise<void> {
        return this.productsService.delete(id);
    }
}
