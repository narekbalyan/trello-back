import {Request, Response} from "express";
import {boardService} from "../services/boards";


class BoardController {
    async getBoards(req: Request, res: Response) {
        return await boardService.getBoards(req)
    }

    async getBoardById(req: Request, res: Response) {
        return await boardService.getBoardById(req.params.id, req)
    }

    async createBoard(req: Request, res: Response) {
        return await boardService.createBoard(req.body)
    }

    async deleteBoard(req: Request, res: Response) {
        return await boardService.deleteBoard(req.params.id, req)
    }

    async editBoard(req: Request, res: Response) {
        return await boardService.editBoard(req.params.id, req.body)
    }

    async orderLists(req: Request, res: Response) {
        return await boardService.orderLists(req.params.id, req.body)
    }

    async leaveBoard(req: Request, res: Response) {
        return await boardService.leaveBoard(req)
    }
}

export const boardsController = new BoardController();