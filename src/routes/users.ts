import express, {Request, Response} from 'express';
import {usersController} from '../controllers/users';
import {routeHandler} from "../handlers/errorHandler";

export const routerUsers = express.Router();

routerUsers.get("/", routeHandler(async (req: Request, res: Response) => {
    return usersController.getUsers(req, res)
}));

routerUsers.post("/invite", routeHandler(async (req: Request, res: Response) => {
    return usersController.inviteUser(req, res)
}));

routerUsers.get("/:id", routeHandler(async (req: Request, res: Response) => {
    return usersController.getUserById(req, res)
}));

routerUsers.delete("/:id", routeHandler(async (req: Request, res: Response) => {
    return usersController.deleteUser(req, res)
}));

routerUsers.patch("/:id", routeHandler(async (req: Request, res: Response) => {
    return usersController.editUser(req, res)
}));

routerUsers.patch("/ordering/:id", routeHandler(async (req: Request, res: Response) => {
    return usersController.editBoardOrdering(req, res)
}));