import express, {Request, Response} from 'express';
import {commentsController} from '../controllers/comments';
import {routeHandler} from "../handlers/errorHandler";

export const routerComments = express.Router();

routerComments.get("/", routeHandler(async (req: Request, res: Response) => {
    return await commentsController.getComments(req, res)
}));

routerComments.get("/:id", routeHandler(async (req: Request, res: Response) => {
    return await commentsController.getCommentById(req, res)
}));

routerComments.post("/", routeHandler(async (req: Request, res: Response) => {
    return await commentsController.createComment(req, res)
}));

routerComments.delete("/:id", routeHandler(async (req: Request, res: Response) => {
    return await commentsController.deleteComment(req, res)
}));

routerComments.patch("/:id", routeHandler(async (req: Request, res: Response) => {
    return await commentsController.editComment(req, res)
}));

