import {BelongsToMany, Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";
import {ApiProperty} from "@nestjs/swagger";
import {User} from "../users/users.model";
import {UserEvents} from "./user-events.model";

interface EventCreationAttrs {
    date: string;
    description: string;
    authorId: number;
    guestId: number;
}
@Table({tableName: "events"})
export class Event extends Model<Event,EventCreationAttrs>{
    @ApiProperty({example: '1', description: "Identificator"})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    // @ApiProperty({example: 'user@mail.com', description: "User email"})
    @Column({type: DataType.STRING, allowNull: false})
    date: string;

    @Column({type: DataType.STRING, allowNull: false})
    description: string;

    @ForeignKey(()=>User)
    @Column({type: DataType.INTEGER, allowNull: false})
    guestId: number;

    @ForeignKey(()=>User)
    @Column({type: DataType.INTEGER, allowNull: false})
    authorId: number;

    @BelongsToMany(()=>User, ()=>UserEvents)
    users: User[];

}