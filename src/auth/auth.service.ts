import {Body, HttpException, HttpStatus, Injectable, Post, UnauthorizedException} from '@nestjs/common';
import {CreateUserDto} from "../users/dto/create-user.dto";
import {LoginUserDto} from "../users/dto/login-user.dto";
import {UsersService} from "../users/users.service";
import {JwtService} from "@nestjs/jwt";
import * as bcrypt from 'bcryptjs'
import {User} from "../users/users.model";

@Injectable()
export class AuthService {

    constructor(private userService: UsersService,
                private jwtService: JwtService) {
    }

    async login(userDto: LoginUserDto){
        const user = await this.validateUser(userDto);
        const {name, email, events, posts} = user;
        return {name, email, events, posts, ...await this.generateToken(user)};
    }

    async registration(userDto: CreateUserDto){
        const candidate = await this.userService.getUserByEmail(userDto.email)

        if (candidate){
            throw new HttpException('User already exists', HttpStatus.BAD_REQUEST)
        }

        const hashPassword = await bcrypt.hash(userDto.password, 5);
        const user = await this.userService.createUser({...userDto, password: hashPassword})

        // return this.generateToken(user);
        return {id: user.id, name: user.name, email: user.email, ...await this.generateToken(user)};
    }

    async authUser(userDto){
        const user = await this.userService.getUserByEmail(userDto.email);
        if (user){
            const {name, email, events, posts} = user;
            return {email, name, events, posts, ...await this.generateToken(user)};
        }
        throw new UnauthorizedException({message: "Expired token"})
    }

    private async generateToken(user: User){
        const payload = {email: user.email, name: user.name, id: user.id, roles: user.roles, events: user.events}

        return {
            token: this.jwtService.sign(payload)
        }
    }

    private async validateUser(userDto: CreateUserDto | LoginUserDto) {
        const user = await this.userService.getUserByEmail(userDto.email);
        const passwordEquels = await bcrypt.compare(userDto.password, user.password)
        if (user && passwordEquels){
            return user
        }
        throw new UnauthorizedException({message: "Wrong email or password"})
    }
}
