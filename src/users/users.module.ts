import {forwardRef, Module} from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import {SequelizeModule} from "@nestjs/sequelize";
import {User} from "./users.model";
import {Role} from "../roles/roles.model";
import {UserRoles} from "../roles/user-roles.model";
import {RolesModule} from "../roles/roles.module";
import {AuthModule} from "../auth/auth.module";
import {Post} from "../posts/posts.model";
import {Event} from "../events/events.model";
import {UserEvents} from "../events/user-events.model";
import {EventsModule} from "../events/events.module";

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
      SequelizeModule.forFeature([User, Role, UserRoles, Post, Event, UserEvents]),
      RolesModule,
      EventsModule,
      forwardRef(() => AuthModule)
  ],
    exports: [
        UsersService,
    ]
})
export class UsersModule {}
