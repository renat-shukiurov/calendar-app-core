import {BelongsToMany, Column, DataType, HasMany, Model, Table} from "sequelize-typescript";
import {ApiProperty} from "@nestjs/swagger";
import {UserRoles} from "../roles/user-roles.model";
import {Role} from "../roles/roles.model";
import {Post} from "../posts/posts.model";
import {Event} from "../events/events.model";
import {UserEvents} from "../events/user-events.model";

interface UserCreationAttrs {
    email: string,
    name: string,
    password: string,

}
@Table({tableName: "users"})
export class User extends Model<User,UserCreationAttrs>{
    @ApiProperty({example: '1', description: "Identificator"})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ApiProperty({example: 'user@mail.com', description: "User email"})
    @Column({type: DataType.STRING, unique: true, allowNull: false})
    email: string;

    @ApiProperty({example: 'Renat', description: "User name"})
    @Column({type: DataType.STRING, allowNull: false})
    name: string;

    @ApiProperty({example: 'yourpass', description: "User Password"})
    @Column({type: DataType.STRING, allowNull: false})
    password: string;

    @ApiProperty({example: 'true', description: "Banned or not"})
    @Column({type: DataType.BOOLEAN, defaultValue: false})
    banned: boolean;

    @ApiProperty({example: 'Spam', description: "Ban reason "})
    @Column({type: DataType.STRING, allowNull: true})
    banReason: string;

    @BelongsToMany(()=>Role, ()=>UserRoles)
    roles: Role[];

    @HasMany(() => Post)
    posts: Post[];

    @BelongsToMany(() => Event, ()=>UserEvents)
    events: Event[];
}