import express, {Request, Response} from "express";
import {loginController} from "../controllers/login";
import {routeHandler} from "../handlers/errorHandler";

export const routerLogin = express.Router();

routerLogin.post('/', routeHandler(async (req: Request, res: Response) => {
    return loginController.login(req, res)
}));