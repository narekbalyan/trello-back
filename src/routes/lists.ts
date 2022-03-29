import express, {Request, Response} from 'express';
import {listsController} from '../controllers/lists';
import {routeHandler} from "../handlers/errorHandler";

export const routerLists = express.Router();

routerLists.get("/", routeHandler(async (req: Request, res: Response) => {
    return await listsController.getLists(req, res)

}));

routerLists.get("/:id", routeHandler(async (req: Request, res: Response) => {
    return await listsController.getListById(req, res)

}));

routerLists.post("/", routeHandler(async (req: Request, res: Response) => {
    return await listsController.createList(req, res)

}));

routerLists.delete("/:id", routeHandler(async (req: Request, res: Response) => {
    return await listsController.deleteList(req, res)

}));

routerLists.patch("/:id", routeHandler(async (req: Request, res: Response) => {
    return await listsController.editList(req, res)
}));

routerLists.patch("/ordering/:id", routeHandler(async (req: Request, res: Response) => {
    return await listsController.editCardOrdering(req, res)
}));

