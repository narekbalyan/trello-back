import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn} from "typeorm";
import {ListsModel} from "../models/lists";
import {Board} from "./Boards";
import {User} from "./Users";


@Entity()
export class List implements ListsModel {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToOne(type => Board)
    @JoinColumn({
        name: "board_id",
        referencedColumnName: "id"
    })
    board_id: string;

    @ManyToOne(type => User)
    @JoinColumn({
        name: "user_id",
        referencedColumnName: "id"
    })
    user_id: string;

    @Column({ type: "varchar" })
    title: string;

    @Column({ type: "varchar" })
    status: string;

    @Column({ type: "varchar" })
    created: Date;

    @Column({ type: "varchar", nullable: true })
    updated: Date;

    @Column({type: "simple-array", nullable: true})
    cards: Array<string>;
}