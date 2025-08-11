import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, MinLength } from "class-validator";

export class CreateUserDto {
    @ApiProperty({
        description: "The name of the user",
        example: "John Doe",
    })
    @IsString()
    @IsNotEmpty()
    readonly name!: string;

    @ApiProperty({
        description: "The email of the user",
        example: "john.doe@example.com",
    })
    @IsString()
    @IsNotEmpty()
    readonly email!: string;

    @ApiProperty({
        description: "The phone number of the user",
        example: "1234567890",
    })
    @IsString()
    @IsNotEmpty()
    readonly phone!: string;

    @ApiProperty({
        description: "The password of the user",
        example: "password123",
        minLength: 6,
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    readonly password!: string;
}
