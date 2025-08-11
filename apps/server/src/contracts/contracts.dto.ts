import { IsDateString, IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CreateContractDto {
    @IsUUID()
    @IsNotEmpty()
    orderId!: string;

    @IsString()
    @IsNotEmpty()
    rentalPeriod!: string;

    @IsDateString()
    startDate!: string;
}

export class UpdateContractDto {
    @IsUUID()
    orderId?: string;

    @IsString()
    rentalPeriod?: string;

    @IsDateString()
    startDate?: string;
}
