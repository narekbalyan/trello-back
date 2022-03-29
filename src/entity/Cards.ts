import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn} from "typeorm";
import {CardsModel} from "../models/cards";
import {User} from "./Users";
import {Board} from "./Boards";
import {List} from "./Lists";


@Entity()
export class Card implements CardsModel {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "varchar" })
    title: string;

    @Column({ type: "varchar", nullable: true })
    description: string;

    @Column({ type: "int", nullable: true })
    estimate: number;

    @Column({ type: "varchar" })
    status: string;
    
    @Column({ type: "varchar" })
    created: Date;

    @Column({ type: "varchar", nullable: true })
    updated: Date;

    @Column({ type: "varchar" })
    listId: string;
    
    @ManyToOne(type => User)
    @JoinColumn({
        name: "user_id",
        referencedColumnName: "id"
    })
    user_id: string;

    @ManyToOne(type => List)
    @JoinColumn({
        name: "list_id",
        referencedColumnName: "id"
    })
    list_id: string;
    
    @ManyToOne(type => Board)
    @JoinColumn({
        name: "board_id",
        referencedColumnName: "id"
    })
    board_id: string;
}