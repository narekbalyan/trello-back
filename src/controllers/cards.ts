import {Request, Response} from "express";
import {cardService} from "../services/cards"

class CardController {
    async getCards(req: Request, res: Response) {
        return await cardService.getCards(req)
    }

    async getCardById(req: Request, res: Response) {
        return await cardService.getCardById(req.params.id)
    }

    async createCard(req: Request, res: Response) {
        return await cardService.createCard( req.body)
    }

    async deleteCard(req: Request, res: Response) {
        return await cardService.deleteCard( req.params.id)
    }

    async editCard(req: Request, res: Response) {
        return await cardService.editCard(req.params.id, req.body)
    }
}

export const cardsController = new CardController();