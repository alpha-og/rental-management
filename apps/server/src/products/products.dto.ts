import { IsString, IsNotEmpty, MinLength, IsNumber } from "class-validator";

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    readonly name!: string;

    @IsNumber()
    @IsNotEmpty()
    @MinLength(1)
    readonly price!: number;

    @IsString()
    readonly description?: string;

    @IsNumber()
    @IsNotEmpty()
    readonly quantity!: number;
}
