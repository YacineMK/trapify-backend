import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateUserDto {
    readonly id?: string;
    
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}