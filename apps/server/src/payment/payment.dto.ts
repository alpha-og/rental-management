import { IsString, IsOptional, IsEnum, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

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
    @ApiProperty({
        description: "The three-character ISO-4217 currency code.",
        example: "USD",
    })
    @IsString()
    currency_code!: string;

    @ApiProperty({ description: "The currency value.", example: "100.00" })
    @IsString()
    value!: string;
}

export class PayerDto {
    @ApiPropertyOptional({
        description: "The payer's email address.",
        example: "payer@example.com",
    })
    @IsOptional()
    @IsString()
    email_address?: string;

    @ApiPropertyOptional({
        description: "The payer's given name.",
        example: "John",
    })
    @IsOptional()
    @IsString()
    given_name?: string;

    @ApiPropertyOptional({
        description: "The payer's surname.",
        example: "Doe",
    })
    @IsOptional()
    @IsString()
    surname?: string;
}

export class CreatePaymentDto {
    @ApiProperty({
        enum: PaymentIntent,
        description: "The payment intent.",
        example: PaymentIntent.CAPTURE,
    })
    @IsEnum(PaymentIntent)
    intent!: PaymentIntent;

    @ApiProperty({ description: "The amount of the payment." })
    @ValidateNested()
    @Type(() => AmountDto)
    amount!: AmountDto;

    @ApiPropertyOptional({
        description: "A description of the payment.",
        example: "Rental payment for apartment",
    })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiPropertyOptional({
        description: "A custom ID for the payment.",
        example: "INV-2023-001",
    })
    @IsOptional()
    @IsString()
    custom_id?: string;

    @ApiPropertyOptional({
        description:
            "The URL to which the payer is redirected after the payment is approved.",
        example: "https://example.com/success",
    })
    @IsOptional()
    @IsString()
    return_url?: string;

    @ApiPropertyOptional({
        description:
            "The URL to which the payer is redirected after the payer cancels the payment.",
        example: "https://example.com/cancel",
    })
    @IsOptional()
    @IsString()
    cancel_url?: string;

    @ApiPropertyOptional({ description: "The payer details." })
    @IsOptional()
    @ValidateNested()
    @Type(() => PayerDto)
    payer?: PayerDto;
}

export class CapturePaymentDto {
    @ApiProperty({
        description: "The ID of the payment order to capture.",
        example: "5O43210987654321C",
    })
    @IsString()
    payment_id!: string;

    @ApiPropertyOptional({
        description:
            "The amount to capture. If not provided, the full amount of the order is captured.",
    })
    @IsOptional()
    @ValidateNested()
    @Type(() => AmountDto)
    amount?: AmountDto;

    @ApiPropertyOptional({
        description: "A note to the payer.",
        example: "Thank you for your payment!",
    })
    @IsOptional()
    @IsString()
    note_to_payer?: string;
}

export class RefundPaymentDto {
    @ApiProperty({
        description: "The ID of the captured payment to refund.",
        example: "9876543210987654321",
    })
    @IsString()
    capture_id!: string;

    @ApiPropertyOptional({
        description:
            "The amount to refund. If not provided, the full amount of the capture is refunded.",
    })
    @IsOptional()
    @ValidateNested()
    @Type(() => AmountDto)
    amount?: AmountDto;

    @ApiPropertyOptional({
        description: "A note to the payer.",
        example: "Refund for cancelled order",
    })
    @IsOptional()
    @IsString()
    note_to_payer?: string;
}

export class PaymentResponseDto {
    @ApiProperty({
        description: "The ID of the payment order.",
        example: "5O43210987654321C",
    })
    @IsString()
    id!: string;

    @ApiProperty({
        enum: PaymentStatus,
        description: "The status of the payment order.",
        example: PaymentStatus.COMPLETED,
    })
    @IsEnum(PaymentStatus)
    status!: PaymentStatus;

    @ApiProperty({ description: "The amount of the payment." })
    @ValidateNested()
    @Type(() => AmountDto)
    amount!: AmountDto;

    @ApiPropertyOptional({
        description:
            "The URL to which the payer is redirected to approve the payment.",
        example: "https://www.paypal.com/checkout?token=EC-5O43210987654321C",
    })
    @IsOptional()
    @IsString()
    approval_url?: string;

    @ApiPropertyOptional({
        description: "The ID of the captured payment.",
        example: "9876543210987654321",
    })
    @IsOptional()
    @IsString()
    capture_id?: string;

    @ApiPropertyOptional({
        description: "The date and time when the payment order was created.",
        example: "2023-08-12T10:00:00Z",
    })
    @IsOptional()
    create_time?: string;

    @ApiPropertyOptional({
        description:
            "The date and time when the payment order was last updated.",
        example: "2023-08-12T10:05:00Z",
    })
    @IsOptional()
    update_time?: string;
}
