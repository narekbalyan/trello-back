import express, {Response} from "express";
import {logoutController} from "../controllers/logout";
import {routeHandler} from "../handlers/errorHandler";

export const routerLogout = express.Router();

routerLogout.post('/', routeHandler(async (req: Response, res: Response) => {
    return await logoutController.logout(req, res)
}));