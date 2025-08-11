import {
    IsBoolean,
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUUID,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateOrderDto {
    @ApiProperty({
        description: "The ID of the quotation this order belongs to",
        example: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
    })
    @IsUUID()
    @IsNotEmpty()
    quotationId!: string;

    @ApiProperty({
        description: "The delivery address for the order",
        example: "123 Main St, Anytown, USA",
    })
    @IsString()
    @IsNotEmpty()
    deliveryAddress!: string;

    @ApiProperty({
        description: "Whether the end user has confirmed the order",
        example: false,
    })
    @IsBoolean()
    endUserConfirmation!: boolean;

    @ApiProperty({
        description: "Whether the customer has confirmed the order",
        example: false,
    })
    @IsBoolean()
    customerConfirmation!: boolean;

    @ApiProperty({
        description: "The status of the order",
        enum: ["pending", "confirmed", "cancelled"],
        example: "pending",
    })
    @IsEnum(["pending", "confirmed", "cancelled"])
    status: "pending" | "confirmed" | "cancelled" = "pending";
}

export class UpdateOrderDto {
    @ApiProperty({
        description: "The ID of the quotation this order belongs to",
        example: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
        required: false,
    })
    @IsUUID()
    @IsOptional()
    quotationId?: string;

    @ApiProperty({
        description: "The delivery address for the order",
        example: "123 Main St, Anytown, USA",
        required: false,
    })
    @IsString()
    @IsOptional()
    deliveryAddress?: string;

    @ApiProperty({
        description: "Whether the end user has confirmed the order",
        example: false,
        required: false,
    })
    @IsBoolean()
    @IsOptional()
    endUserConfirmation?: boolean;

    @ApiProperty({
        description: "Whether the customer has confirmed the order",
        example: false,
        required: false,
    })
    @IsBoolean()
    @IsOptional()
    customerConfirmation?: boolean;

    @ApiProperty({
        description: "The status of the order",
        enum: ["pending", "confirmed", "cancelled"],
        example: "pending",
        required: false,
    })
    @IsEnum(["pending", "confirmed", "cancelled"])
    @IsOptional()
    status?: "pending" | "confirmed" | "cancelled";
}
