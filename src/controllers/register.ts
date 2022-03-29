import {Request, Response} from "express";
import {registerService} from "../services/register";

class RegisterController {
    async register(req: Request, res: Response) {
        return await registerService.register(req.body)
    }
}

export const registerController = new RegisterController();
