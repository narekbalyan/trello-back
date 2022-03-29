import {SessionModel} from "../models/session";
import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";


@Entity()
export class Session implements SessionModel {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "uuid" })
    userId: string;
}