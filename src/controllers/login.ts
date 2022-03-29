import {Request, Response} from "express";
import {loginService} from "../services/login";

class LoginController {
    async login(req: Request, res: Response) {
        return await loginService.loginService(req.body)
    }
}

export const loginController = new LoginController()