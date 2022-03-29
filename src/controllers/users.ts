import {Request, Response} from "express";
import {userService} from "../services/users"

class UserController {
    async getUsers(req: Request, res: Response) {
        return await userService.getUsers()
    }

    async getUserById(req: Request, res: Response) {
        return await userService.getUserById(req.params.id)
    }

    async deleteUser(req: Request, res: Response) {
        return await userService.deleteUser(req.params.id)

    }

    async editUser(req: Request, res: Response) {
        return await userService.editUser(req.params.id, req.body)
    }

    async inviteUser(req: Request, res: Response) {
        return await userService.inviteUser(req)
    }

    async editBoardOrdering(req: Request, res: Response) {
        return await userService.editBoardOrdering(req.params.id, req.body)
    }
}

export const usersController = new UserController();