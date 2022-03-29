import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn} from "typeorm";
import {CommentsModel} from "../models/comments";
import {User} from "./Users";
import {Card} from "./Cards";
import {Board} from "./Boards";
import {List} from "./Lists";


@Entity()
export class Comment implements CommentsModel {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToOne(type => Card)
    @JoinColumn({
        name: "card_id",
        referencedColumnName: "id"
    })
    card_id: string;

    @ManyToOne(type => User)
    @JoinColumn({
        name: "user_id",
        referencedColumnName: "id"
    })
    user_id: string;

    @ManyToOne(type => Board)
    @JoinColumn({
        name: "board_id",
        referencedColumnName: "id"
    })
    board_id: string;

    @ManyToOne(type => List)
    @JoinColumn({
        name: "list_id",
        referencedColumnName: "id"
    })
    list_id: string;

    @Column({ type: "varchar" })
    creator_id: string;

    @Column({ type: "varchar" })
    context: string;

    @Column({ type: "varchar" })
    status: string;
    
    @Column({ type: "varchar" })
    created: Date;

    @Column({ type: "varchar", nullable: true })
    updated: Date;
}