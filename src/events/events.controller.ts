import {Controller, Post, Body, Req} from '@nestjs/common';
import {EventsService} from "./events.service";
import {CreateEventDto} from "./dto/create-event.dto";

@Controller('events')
export class EventsController {

    constructor(private eventService: EventsService) {
    }

    @Post()
    createEvent(@Body() dto: CreateEventDto){
        return this.eventService.create(dto)
    }
}
