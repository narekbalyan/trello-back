import {Request, Response} from "express";
import {listService} from "../services/lists"

class ListController {
    async getLists(req: Request, res: Response) {
        return await listService.getLists(req)
    }

    async getListById(req: Request, res: Response) {
        return await listService.getListById(req.params.id)
    }

    async createList(req: Request, res: Response) {
        return await listService.createList(req.body)
    }

    async deleteList(req: Request, res: Response) {
        return await listService.deleteList(req.params.id)
    }

    async editList(req: Request, res: Response) {
        return await listService.editList(req.params.id, req.body)
    }

    async editCardOrdering(req: Request, res: Response) {
        return await listService.editCardOrdering(req.params.id, req.body)
    }
}

export const listsController = new ListController();