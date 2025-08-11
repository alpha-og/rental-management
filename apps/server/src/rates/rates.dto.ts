import {
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsPositive,
    IsUUID,
    IsBoolean,
} from "class-validator";
import { RateDuration } from "./rate.model";
import { ApiProperty } from "@nestjs/swagger";

export class CreateRateDto {
    @ApiProperty({
        description: "The ID of the product this rate belongs to",
        example: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
    })
    @IsUUID()
    @IsNotEmpty()
    productId!: string;

    @ApiProperty({
        description: "The duration of the rate",
        enum: RateDuration,
        example: RateDuration.DAILY,
    })
    @IsEnum(RateDuration)
    duration!: RateDuration;

    @ApiProperty({
        description: "The price of the rate",
        example: 99.99,
    })
    @IsNumber({ maxDecimalPlaces: 2 })
    @IsPositive()
    price!: number;

    @ApiProperty({
        description: "Whether this is an extra rate",
        example: false,
    })
    @IsBoolean()
    isExtra!: boolean;
}

export class UpdateRateDto {
    @ApiProperty({
        description: "The duration of the rate",
        enum: RateDuration,
        example: RateDuration.DAILY,
        required: false,
    })
    @IsEnum(RateDuration)
    duration?: RateDuration;

    @ApiProperty({
        description: "The price of the rate",
        example: 99.99,
        required: false,
    })
    @IsNumber({ maxDecimalPlaces: 2 })
    @IsPositive()
    price?: number;

    @ApiProperty({
        description: "Whether this is an extra rate",
        example: false,
        required: false,
    })
    @IsBoolean()
    isExtra?: boolean;
}
