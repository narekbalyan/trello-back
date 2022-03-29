import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";
import {UsersModel} from "../models/users"

@Entity()
export class User implements UsersModel {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "varchar" })
    user_name: string;

    @Column({ type: "varchar" })
    email: string;

    @Column({ type: "varchar" })
    password: string;

    @Column({ type: "varchar", nullable: true })
    status: string;

    @Column({ type: "varchar" })
    created: Date;

    @Column({ type: "varchar", nullable: true })
    updated: Date;

    @Column({type: "simple-array", nullable: true})
    membership: Array<string>;

    @Column({type: "simple-array", nullable: true})
    boards: Array<string>;
}