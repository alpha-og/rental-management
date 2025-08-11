import {
    IsInt,
    IsNotEmpty,
    IsUUID,
    IsPositive,
    IsOptional,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateQuotationDto {
    @ApiProperty({
        description: "The ID of the product this quotation belongs to",
        example: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
    })
    @IsUUID()
    @IsNotEmpty()
    productId!: string;

    @ApiProperty({
        description: "The ID of the rate this quotation belongs to",
        example: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
    })
    @IsUUID()
    @IsNotEmpty()
    rateId!: string;

    @ApiProperty({
        description: "The quantity of the product in the quotation",
        example: 10,
    })
    @IsInt()
    @IsPositive()
    quantity!: number;
}

export class UpdateQuotationDto {
    @ApiProperty({
        description: "The ID of the product this quotation belongs to",
        example: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
        required: false,
    })
    @IsUUID()
    @IsOptional()
    productId?: string;

    @ApiProperty({
        description: "The ID of the rate this quotation belongs to",
        example: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
        required: false,
    })
    @IsUUID()
    @IsOptional()
    rateId?: string;

    @ApiProperty({
        description: "The quantity of the product in the quotation",
        example: 10,
        required: false,
    })
    @IsInt()
    @IsPositive()
    @IsOptional()
    quantity?: number;
}
