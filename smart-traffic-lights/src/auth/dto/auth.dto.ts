import { ApiProperty, ApiTags } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class AuthLoginDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: 'User name' })
    user_name: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: 'Password' })
    password: string;
}

export class AuthSignUpDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: 'User ID' })
    user_id: string

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'User name' })
    user_name: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: 'User role' })
    role: string

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'Password' })
    password: string
}