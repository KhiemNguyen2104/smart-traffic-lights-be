import { IsString } from "class-validator";

export class AuthLoginDto {
    @IsString()
    user_name: string;
    @IsString()
    password: string;
}

export class AuthSignUpDto {
    // TODO
}