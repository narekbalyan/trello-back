import express, {Request, Response} from 'express';
import {registerController} from '../controllers/register';
import {routeHandler} from "../handlers/errorHandler";

export const routerRegister = express.Router();

routerRegister.post('/', routeHandler(async (req: Request, res: Response) => {
    return await registerController.register(req, res)
}));