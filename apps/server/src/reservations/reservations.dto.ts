import { IsBoolean, IsNotEmpty, IsOptional, IsUUID } from "class-validator";

export class CreateReservationDto {
    @IsUUID()
    @IsNotEmpty()
    orderId!: string;

    @IsBoolean()
    isValid!: boolean;
}

export class UpdateReservationDto {
    @IsUUID()
    @IsOptional()
    orderId?: string;

    @IsBoolean()
    @IsOptional()
    isValid?: boolean;
}
