import {
    IsDateString,
    IsNotEmpty,
    IsString,
    IsUUID,
    IsOptional,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateContractDto {
    @ApiProperty({
        description: "The ID of the order this contract belongs to",
        example: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
    })
    @IsUUID()
    @IsNotEmpty()
    orderId!: string;

    @ApiProperty({
        description: "The rental period of the contract",
        example: "P1M10D",
    })
    @IsString()
    @IsNotEmpty()
    rentalPeriod!: string;

    @ApiProperty({
        description: "The start date of the contract",
        example: "2025-12-25T12:00:00.000Z",
    })
    @IsDateString()
    startDate!: string;
}

export class UpdateContractDto {
    @ApiProperty({
        description: "The ID of the order this contract belongs to",
        example: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
        required: false,
    })
    @IsUUID()
    @IsOptional()
    orderId?: string;

    @ApiProperty({
        description: "The rental period of the contract",
        example: "P1M10D",
        required: false,
    })
    @IsString()
    @IsOptional()
    rentalPeriod?: string;

    @ApiProperty({
        description: "The start date of the contract",
        example: "2025-12-25T12:00:00.000Z",
        required: false,
    })
    @IsDateString()
    @IsOptional()
    startDate?: string;
}
