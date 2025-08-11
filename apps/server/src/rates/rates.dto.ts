import {
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsPositive,
    IsUUID,
    IsBoolean,
} from "class-validator";
import { RateDuration } from "./rate.model";

export class CreateRateDto {
    @IsUUID()
    @IsNotEmpty()
    productId!: string;

    @IsEnum(RateDuration)
    duration!: RateDuration;

    @IsNumber({ maxDecimalPlaces: 2 })
    @IsPositive()
    price!: number;

    @IsBoolean()
    isExtra!: boolean;
}

export class UpdateRateDto {
    @IsEnum(RateDuration)
    duration?: RateDuration;

    @IsNumber({ maxDecimalPlaces: 2 })
    @IsPositive()
    price?: number;

    @IsBoolean()
    isExtra?: boolean;
}
