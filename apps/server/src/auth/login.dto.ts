import { IsString, IsNotEmpty, IsEmail } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {
    @ApiProperty({
        description: "The email of the user",
        example: "john.doe@example.com",
        format: "email",
    })
    @IsEmail()
    @IsNotEmpty()
    email!: string;

    @ApiProperty({
        description: "The password of the user",
        example: "password123",
    })
    @IsString()
    @IsNotEmpty()
    password!: string;
}
