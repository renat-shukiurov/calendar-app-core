import {BelongsTo, BelongsToMany, Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";
import {ApiProperty} from "@nestjs/swagger";
import {UserRoles} from "../roles/user-roles.model";
import {Role} from "../roles/roles.model";
import {User} from "../users/users.model";

interface PostCreationAttrs {
    title: string;
    content: string;
    userId: number;
    image: string;

}
@Table({tableName: "posts"})
export class Post extends Model<Post,PostCreationAttrs>{
    @ApiProperty({example: '1', description: "Identificator"})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    // @ApiProperty({example: 'user@mail.com', description: "User email"})
    @Column({type: DataType.STRING, unique: true, allowNull: false})
    title: string;

    // @ApiProperty({example: 'yourpass', description: "User Password"})
    @Column({type: DataType.STRING, allowNull: false})
    content: string;

    @Column({type: DataType.STRING})
    image: string;

    @ForeignKey(()=>User)
    @Column({type: DataType.INTEGER})
    userId: number

    @BelongsTo(() => User)
    author: User
}