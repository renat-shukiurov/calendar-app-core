import {ApiProperty} from "@nestjs/swagger";
import {IsEmail, IsString, Length} from "class-validator";

export class LoginUserDto {
    @ApiProperty({example: 'user@mail.com', description: "User email"})
    @IsString({message: 'Must be string'})
    @IsEmail({}, {message: "Incorrect mail"})
    readonly email: string;

    @ApiProperty({example: 'yourpass', description: "User Password"})
    @IsString({message: 'Must be string'})
    @Length(4, 16, {message: "Not less than 4 and not more than 16"})
    readonly password: string;
}