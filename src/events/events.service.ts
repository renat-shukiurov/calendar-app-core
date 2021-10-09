import { Injectable } from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {Event} from "./events.model";
import {CreateEventDto} from "./dto/create-event.dto";

@Injectable()
export class EventsService {

    constructor(@InjectModel(Event) private eventRepository: typeof Event) {
    }

     async create(dto: CreateEventDto) {
        const event = await this.eventRepository.create(dto)

        return event;
    }
}
