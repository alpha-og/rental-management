import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, MinLength } from "class-validator";

export class CreateUserDto {
    @ApiProperty({
        description: "The username of the user",
        example: "johndoe",
    })
    @IsString()
    @IsNotEmpty()
    readonly username!: string;

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
