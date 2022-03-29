import {Response} from "express";
import {Exception} from "./Exception";

export function responseJsonHandler(error: any, result: any, response:Response) {
    if (error) {
        if (!error.message) {
            error.message = "Unhandled message"
        }
        return response.status(error.status ? error.status : 404).json({message: error.message});
    }
    response.json(result);
}

export const routeHandler = function (callback: any) {
    return async (req: any, res: any, next: any) => {
        try {
            responseJsonHandler(null, await callback(req, res, next), res);
        } catch (err: any) {
            responseJsonHandler(new Exception(err.message, err.status), null, res);
        }
    }
}