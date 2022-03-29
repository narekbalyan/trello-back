import express, {Response, Request} from 'express';
import {boardsController} from '../controllers/boards';
import {routeHandler} from "../handlers/errorHandler";

export const routerBoards = express.Router();

routerBoards.get("/", routeHandler(async (req: Request, res: Response) => {
    return await boardsController.getBoards(req, res)
}));

routerBoards.get("/:id", routeHandler(async (req: Request, res: Response) => {
    return await boardsController.getBoardById(req, res)
}));

routerBoards.post("/", routeHandler(async (req: Request, res: Response) => {
    return await boardsController.createBoard(req, res)
}));

routerBoards.post("/leave", routeHandler(async (req: Request, res: Response) => {
    return await boardsController.leaveBoard(req, res)
}));
routerBoards.delete("/:id", routeHandler(async (req: Request, res: Response) => {
    return await boardsController.deleteBoard(req, res)
}));

routerBoards.patch("/:id", routeHandler(async (req: Request, res: Response) => {
    return await boardsController.editBoard(req, res)
}));

routerBoards.patch("/ordering/:id", routeHandler(async (req: Request, res: Response) => {
    return await boardsController.orderLists(req, res)
}));