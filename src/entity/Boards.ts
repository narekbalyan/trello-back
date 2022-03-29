import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn} from "typeorm";
import {User} from "./Users";
import {BoardsModel} from "../models/boards";


@Entity()
export class Board implements BoardsModel {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "varchar" })
    title: string;

    @Column({ type: "varchar" })
    status: string;

    @Column({ type: "int" })
    members_count: number;
    
    @Column({ type: "varchar" })
    created: Date;

    @Column({ type: "varchar", nullable: true })
    updated: Date;

    @Column({type: "simple-array", nullable: true})
    lists: Array<string>;

    @Column({type: "varchar"})
    owner_id: string;

    @ManyToOne(type => User)
    @JoinColumn({
        name: "user_id",
        referencedColumnName: "id"
    })
    user_id: string;
}