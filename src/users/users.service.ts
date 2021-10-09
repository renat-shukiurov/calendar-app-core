import {HttpException, HttpStatus, Injectable, UnauthorizedException} from '@nestjs/common';
import {User} from "./users.model";
import {InjectModel} from "@nestjs/sequelize";
import {Op} from "sequelize"
import {CreateUserDto} from "./dto/create-user.dto";
import {RolesService} from "../roles/roles.service";
import {AddRoleDto} from "./dto/add-role.dto";
import {BanUserDto} from "./dto/ban-user.dto";
import {EventsService} from "../events/events.service";
import {CreateEventDto} from "../events/dto/create-event.dto";
import {AddEventDto} from "./dto/add-event.dto";
import {JwtService} from "@nestjs/jwt";

@Injectable()
export class UsersService {

    constructor(@InjectModel(User) private userRepository: typeof User,
                private rolesService: RolesService,
                private eventsService: EventsService,
                private jwtService: JwtService) {
    }
    async createUser(dto: CreateUserDto){
        const user = await this.userRepository.create(dto);
        const role = await this.rolesService.getRoleByValue("USER");
        await user.$set('roles', [role.id]);
        user.roles = [role];
        return user;
    }

    async getAllUsers(){
        const users = await this.userRepository.findAll({include: {all:true}});
        return users;
    }

    async getAllGuests(req: Request){
        try {
            const authHeader = req.headers["authorization"];

            const author:any = await this.getUserByToken(authHeader);
            const users = await this.userRepository.findAll({where: {
                    email: {[Op.ne] : author.email}
                },include: {all:true}});

            const guests = users.map(user => {return {email: user.email, username: user.name}})
            return guests;
        }
        catch (e) {
            throw new UnauthorizedException({message: "User isn't logged in"})

        }

    }

    async getUserByEmail(email: string){
        const user = await this.userRepository.findOne({where: {email}, include: {all:true}})

        return user;
    }

    async addRole(dto: AddRoleDto){
        const user = await this.userRepository.findByPk(dto.userId);
        const role = await this.rolesService.getRoleByValue(dto.value);

        if (role && user){
            await user.$add('role', role.id);
            return dto;
        }

        throw new HttpException("User or role doesn't exist", HttpStatus.NOT_FOUND)
    }

    async addEvent(dto: AddEventDto, req: Request){
        try {
            const authHeader = req.headers["authorization"];
            const user = await this.getUserByToken(authHeader);

            const author = await this.userRepository.findByPk(user.id);
            const guest = await this.getUserByEmail(dto.guestEmail);

            const eventDto:CreateEventDto = {
                description: dto.description,
                date: dto.date,
                authorId: author.id,
                guestId: guest.id,
            }

            const event = await this.eventsService.create(eventDto);

            if(event && guest && author){
                await guest.$add('event', event.id);
                await author.$add('event', event.id);

                return dto
            }

            throw new HttpException("Users or event doesn't exist", HttpStatus.NOT_FOUND)

        }
        catch (e) {
            console.log(e);
            throw new UnauthorizedException({message: "User isn't logged in"})

        }

    }

    async getEvents(req: Request){
        const authHeader = req.headers["authorization"];
        const user = await this.getUserByToken(authHeader);

        const eventPromises = await user.events.map(async (event) => {
            const author = await this.userRepository.findByPk(event.authorId);
            const guest = await this.userRepository.findByPk(event.guestId);
            return {
                author: author.name,
                // authorEmail: author.email,
                guest: guest.name,
                // guestEmail: guest.email,
                date: event.date,
                description: event.description,
            }
        })

        return Promise.all(eventPromises).then(function(events) {
            return events
        })
    }

    async ban(dto: BanUserDto) {
        const user = await this.userRepository.findByPk(dto.userId);
        if (!user){
            throw new HttpException("User not found", HttpStatus.NOT_FOUND)
        }
        user.banned = true;
        user.banReason = dto.banReason;
        await user.save();
        return user;
    }

    private async getUserByToken(authHeader: string){
        const bearer = authHeader.split(' ')[0];
        const token = authHeader.split(' ')[1];

        if (bearer !== 'Bearer' || !token){
            throw new UnauthorizedException({message: "User isn't logged in"})
        }

        const id = this.jwtService.verify(token).id
        return await this.userRepository.findOne({where: {id}, include: {all:true}});
    }
}
