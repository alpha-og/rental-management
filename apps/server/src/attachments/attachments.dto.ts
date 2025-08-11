import { IsNotEmpty, IsString, IsUUID, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateAttachmentDto {
    @ApiProperty({
        description: "The ID of the product this attachment belongs to",
        example: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
    })
    @IsUUID()
    @IsNotEmpty()
    productId!: string;

    @ApiProperty({
        description: "The URL of the attachment",
        example: "https://example.com/attachment.pdf",
    })
    @IsString()
    @IsNotEmpty()
    url!: string;
}

export class UpdateAttachmentDto {
    @ApiProperty({
        description: "The URL of the attachment",
        example: "https://example.com/attachment.pdf",
        required: false,
    })
    @IsString()
    @IsOptional()
    url?: string;
}
