import {
    IsBoolean,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUUID,
} from "class-validator";

export class CreateOrderDto {
    @IsUUID()
    @IsNotEmpty()
    quotationId!: string;

    @IsString()
    @IsNotEmpty()
    deliveryAddress!: string;

    @IsBoolean()
    endUserConfirmation!: boolean;

    @IsBoolean()
    customerConfirmation!: boolean;
}

export class UpdateOrderDto {
    @IsUUID()
    @IsOptional()
    quotationId?: string;

    @IsString()
    @IsOptional()
    deliveryAddress?: string;

    @IsBoolean()
    @IsOptional()
    endUserConfirmation?: boolean;

    @IsBoolean()
    @IsOptional()
    customerConfirmation?: boolean;
}
