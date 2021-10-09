import {Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";
import {User} from "../users/users.model";
import {Event} from "./events.model";

@Table({tableName: "user_events", createdAt: false, updatedAt: false})
export class UserEvents extends Model<UserEvents>{

    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ForeignKey(()=>Event)
    @Column({type: DataType.INTEGER})
    eventId: number;

    @ForeignKey(()=>User)
    @Column({type: DataType.INTEGER})
    userId: number;

}