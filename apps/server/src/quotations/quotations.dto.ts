import { IsInt, IsNotEmpty, IsUUID, IsPositive } from "class-validator";

export class CreateQuotationDto {
    @IsUUID()
    @IsNotEmpty()
    productId!: string;

    @IsUUID()
    @IsNotEmpty()
    rateId!: string;

    @IsInt()
    @IsPositive()
    quantity!: number;
}

export class UpdateQuotationDto {
    @IsUUID()
    productId?: string;

    @IsUUID()
    rateId?: string;

    @IsInt()
    @IsPositive()
    quantity?: number;
}
