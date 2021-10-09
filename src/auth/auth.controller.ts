import {Body, Controller, Get, Post, Req, UseGuards} from '@nestjs/common';
import {ApiTags} from "@nestjs/swagger";
import {CreateUserDto} from "../users/dto/create-user.dto";
import {AuthService} from "./auth.service";
import {User} from "./decorators/user-auth.decorator";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {LoginUserDto} from "../users/dto/login-user.dto";

@ApiTags("Authorization")
@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) {
    }

    @Post('/login')
    login(@Body() userDto: LoginUserDto){
        return this.authService.login(userDto)
    }

    @Post('/registration')
    registration(@Body() userDto: CreateUserDto){
        return this.authService.registration(userDto)
    }

    @UseGuards(JwtAuthGuard)
    @Get('/user')
    userAuth(@User() user){
        return this.authService.authUser(user);
    }
}
