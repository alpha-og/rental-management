import { IsNotEmpty, IsUUID, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

// DTO for creating an attachment
export class CreateAttachmentDto {
    @ApiProperty({
        description: "The ID of the product this attachment belongs to",
        example: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
    })
    @IsUUID()
    @IsNotEmpty()
    productId!: string;

    @ApiProperty({
        description: "File to upload",
        type: Buffer,
    })
    @IsNotEmpty()
    file!: File;
}

// DTO for updating an attachment
export class UpdateAttachmentDto {
    @ApiProperty({
        description: "The ID of the product this attachment belongs to",
        example: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
        required: false,
    })
    @IsUUID()
    @IsOptional()
    productId?: string;
}
