import "reflect-metadata";
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import {createConnection } from "typeorm";
import {routerLists} from "./routes/lists"
import {routerCards} from "./routes/cards"
import {routerUsers} from "./routes/users"
import {routerBoards} from "./routes/boards";
import {routerComments} from "./routes/comments";
import {routerLogin} from "./routes/login";
import {routerLogout} from "./routes/logout";
import OrmConfig from "./config/typeorm.config";
import {jwtVerify} from "./authentication/jwtVerify";
import {routerRegister} from "./routes/register";
import swaggerUI from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerDocument from "./swagger.json";


const app = express();

dotenv.config();
app.use(cors());

createConnection(OrmConfig).then(async connection => {
    const PORT = process.env.PORT || 3001;
    app.use(express.json());

    //documentation route
    app.use("/api/docs", swaggerUI.serve, swaggerUI.setup(swaggerJsDoc(swaggerDocument)));

    app.use(jwtVerify);

    //public routes
    app.use("/api/login", routerLogin);
    app.use("/api/register", routerRegister);
    app.use("/api/logout", routerLogout);

    //private routes
    app.use("/api/boards", routerBoards);
    app.use("/api/lists", routerLists);
    app.use("/api/cards", routerCards);
    app.use("/api/users", routerUsers);
    app.use("/api/comments", routerComments);

    app.listen(PORT, () => {
        console.log(`Server is listening on ${PORT}`);
    })

    console.log(`connected`);
    
}).catch(error => console.log(error));