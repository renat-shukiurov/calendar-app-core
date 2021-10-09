import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import {SequelizeModule} from "@nestjs/sequelize";
import {User} from "../users/users.model";
import {Event} from "./events.model";
import {UserEvents} from "./user-events.model";

@Module({
  controllers: [EventsController],
  providers: [EventsService],
  imports: [
    SequelizeModule.forFeature([User, Event, UserEvents]),
  ],
  exports: [
      EventsService
  ]
})
export class EventsModule {}
