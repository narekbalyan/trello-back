import express, {Request, Response} from 'express';
import {cardsController} from '../controllers/cards';
import {routeHandler} from "../handlers/errorHandler";

export const routerCards = express.Router();

routerCards.get("/", routeHandler(async (req: Request, res: Response) => {
    return await cardsController.getCards(req, res)
}));

routerCards.get("/:id", routeHandler(async (req: Request, res: Response) => {
    return await cardsController.getCardById(req, res)
}));

routerCards.post("/", routeHandler(async (req: Request, res: Response) => {
    return await cardsController.createCard(req, res)
}));

routerCards.delete("/:id", routeHandler(async (req: Request, res: Response) => {
    return await cardsController.deleteCard(req, res)
}));

routerCards.patch("/:id", routeHandler(async (req: Request, res: Response) => {
    return await cardsController.editCard(req, res)
}));