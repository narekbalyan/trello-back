import {Request, Response} from "express";
import {commentService} from "../services/comments"

class CommentController {
    async getComments(req: Request, res: Response) {
        return await commentService.getComments(req)
    }

    async getCommentById(req: Request, res: Response) {
        return await commentService.getCommentById(req.params.id)
    }

    async createComment(req: Request, res: Response) {
        return await commentService.createComment(req.body)
    }

    async deleteComment(req: Request, res: Response) {
        return await commentService.deleteComment(req.params.id)
    }

    async editComment(req: Request, res: Response) {
        return await commentService.editComment(req.params.id, req.body)
    }
}

export const commentsController = new CommentController();