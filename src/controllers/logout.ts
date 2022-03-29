import {logoutService} from "../services/logout";
import {Response} from "express";

class Logout {
    async logout(req: Request, res: Response) {
        return await logoutService.logoutService(req)
    }
}

export const logoutController: any =  new Logout();