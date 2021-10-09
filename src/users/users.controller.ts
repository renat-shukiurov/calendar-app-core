import {Body, Controller, Get, Post, Req, UseGuards, UsePipes, Request} from '@nestjs/common';
import {CreateUserDto} from "./dto/create-user.dto";
import {UsersService} from "./users.service";
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {User} from "./users.model";
import {Roles} from "../auth/decorators/roles-auth.decorator";
import {RolesGuard} from "../auth/roles.guard";
import {AddRoleDto} from "./dto/add-role.dto";
import {BanUserDto} from "./dto/ban-user.dto";
import {ValidationPipe} from "../pipes/validation.pipe"
import {AddEventDto} from "./dto/add-event.dto";

@ApiTags('Users')
@Controller('users')
export class UsersController {

    constructor(private usersService: UsersService) {
    }

    @ApiOperation({summary: "Creating user"})
    @ApiResponse({status: 200, type: User})
    @UsePipes(ValidationPipe)
    @Post()
    create(@Body() userDto: CreateUserDto){
        return this.usersService.createUser(userDto);
    }

    @ApiOperation({summary: "Fetching all users"})
    @ApiResponse({status: 200, type: [User]})
    @Roles('ADMIN')
    @UseGuards(RolesGuard)
    @Get()
    getAll(){
        return this.usersService.getAllUsers();
    }

    @ApiOperation({summary: "Fetching all guests"})
    @ApiResponse({status: 200, type: [User]})
    @Roles('USER')
    @UseGuards(RolesGuard)
    @Get("/guests")
    getAllGuests(@Req() req: Request){
        return this.usersService.getAllGuests(req);
    }

    @ApiOperation({summary: "Menage roles"})
    @ApiResponse({status: 200})
    @Roles('ADMIN')
    @UseGuards(RolesGuard)
    @Post("/role")
    addRole(@Body() dto: AddRoleDto){
        return this.usersService.addRole(dto);
    }

    @ApiOperation({summary: "Menage events"})
    @ApiResponse({status: 200})
    @Roles('USER')
    @UseGuards(RolesGuard)
    @Post("/event")
    addEvent(@Body() dto: AddEventDto, @Req() req: Request){
        return this.usersService.addEvent(dto, req);
    }

    @ApiOperation({summary: "Get events"})
    @ApiResponse({status: 200})
    @Roles('USER')
    @UseGuards(RolesGuard)
    @Get("/event")
    getEvents(@Req() req: Request){
        return this.usersService.getEvents(req);
    }

    @ApiOperation({summary: "Ban user"})
    @ApiResponse({status: 200})
    @Roles('ADMIN')
    @UseGuards(RolesGuard)
    @Post("/ban")
    ban(@Body() dto: BanUserDto){
        return this.usersService.ban(dto);
    }
}
