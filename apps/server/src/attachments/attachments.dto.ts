import { IsNotEmpty, IsString, IsUUID, IsOptional } from "class-validator";

export class CreateAttachmentDto {
    @IsUUID()
    @IsNotEmpty()
    productId!: string;

    @IsString()
    @IsNotEmpty()
    url!: string;
}

export class UpdateAttachmentDto {
    @IsString()
    @IsOptional()
    url?: string;
}
