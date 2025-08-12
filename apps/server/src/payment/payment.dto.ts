import { IsString, IsOptional, IsEnum, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

export enum PaymentIntent {
    CAPTURE = "CAPTURE",
    AUTHORIZE = "AUTHORIZE",
}

export enum PaymentStatus {
    CREATED = "CREATED",
    SAVED = "SAVED",
    APPROVED = "APPROVED",
    VOIDED = "VOIDED",
    COMPLETED = "COMPLETED",
    PAYER_ACTION_REQUIRED = "PAYER_ACTION_REQUIRED",
}

export class AmountDto {
    @IsString()
    currency_code!: string;

    @IsString()
    value!: string;
}

export class PayerDto {
    @IsOptional()
    @IsString()
    email_address?: string;

    @IsOptional()
    @IsString()
    given_name?: string;

    @IsOptional()
    @IsString()
    surname?: string;
}

export class CreatePaymentDto {
    @IsEnum(PaymentIntent)
    intent!: PaymentIntent;

    @ValidateNested()
    @Type(() => AmountDto)
    amount!: AmountDto;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    custom_id?: string;

    @IsOptional()
    @IsString()
    return_url?: string;

    @IsOptional()
    @IsString()
    cancel_url?: string;

    @IsOptional()
    @ValidateNested()
    @Type(() => PayerDto)
    payer?: PayerDto;
}

export class CapturePaymentDto {
    @IsString()
    payment_id!: string;

    @IsOptional()
    @ValidateNested()
    @Type(() => AmountDto)
    amount?: AmountDto;

    @IsOptional()
    @IsString()
    note_to_payer?: string;
}

export class RefundPaymentDto {
    @IsString()
    capture_id!: string;

    @IsOptional()
    @ValidateNested()
    @Type(() => AmountDto)
    amount?: AmountDto;

    @IsOptional()
    @IsString()
    note_to_payer?: string;
}

export class PaymentResponseDto {
    @IsString()
    id!: string;

    @IsEnum(PaymentStatus)
    status!: PaymentStatus;

    @ValidateNested()
    @Type(() => AmountDto)
    amount!: AmountDto;

    @IsOptional()
    @IsString()
    approval_url?: string;

    @IsOptional()
    @IsString()
    capture_id?: string;

    @IsOptional()
    create_time?: string;

    @IsOptional()
    update_time?: string;
}
