import {
    IsString,
    IsNotEmpty,
    MinLength,
    IsNumber,
    IsOptional,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateProductDto {
    @ApiProperty({
        description: "The name of the product",
        example: "Excavator",
    })
    @IsString()
    @IsNotEmpty()
    readonly name!: string;

    @ApiProperty({
        description: "The price of the product",
        example: 1000,
    })
    @IsNumber()
    @IsNotEmpty()
    @MinLength(1)
    readonly price!: number;

    @ApiProperty({
        description: "The description of the product",
        example: "A powerful excavator for all your construction needs.",
        required: false,
    })
    @IsString()
    @IsOptional()
    readonly description?: string;

    @ApiProperty({
        description: "The quantity of the product available",
        example: 10,
    })
    @IsNumber()
    @IsNotEmpty()
    readonly quantity!: number;
}

export class UpdateProductDto {
    @ApiProperty({
        description: "The name of the product",
        example: "Excavator",
        required: false,
    })
    @IsString()
    @IsOptional()
    readonly name?: string;

    @ApiProperty({
        description: "The price of the product",
        example: 1000,
        required: false,
    })
    @IsNumber()
    @IsOptional()
    @MinLength(1)
    readonly price?: number;

    @ApiProperty({
        description: "The description of the product",
        example: "A powerful excavator for all your construction needs.",
        required: false,
    })
    @IsString()
    @IsOptional()
    readonly description?: string;

    @ApiProperty({
        description: "The quantity of the product available",
        example: 10,
        required: false,
    })
    @IsNumber()
    @IsOptional()
    readonly quantity?: number;
}
