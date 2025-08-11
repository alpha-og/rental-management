import { IsBoolean, IsNotEmpty, IsOptional, IsUUID } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateReservationDto {
    @ApiProperty({
        description: "The ID of the order this reservation belongs to",
        example: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
    })
    @IsUUID()
    @IsNotEmpty()
    orderId!: string;

    @ApiProperty({
        description: "Whether the reservation is valid",
        example: true,
    })
    @IsBoolean()
    isValid!: boolean;
}

export class UpdateReservationDto {
    @ApiProperty({
        description: "The ID of the order this reservation belongs to",
        example: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
        required: false,
    })
    @IsUUID()
    @IsOptional()
    orderId?: string;

    @ApiProperty({
        description: "Whether the reservation is valid",
        example: true,
        required: false,
    })
    @IsBoolean()
    @IsOptional()
    isValid?: boolean;
}
