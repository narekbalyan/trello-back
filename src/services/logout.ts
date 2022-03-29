import {Exception} from "../handlers/Exception";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import {getConnection} from "typeorm";
import {Session} from "../entity/Session";

dotenv.config();

class LogoutService {
    async logoutService(req: any) {
        const secretKey = process.env.SECRET_KEY || 'dummySecretKey';
        const authHeader: any = req.headers['Authorization'] || req.headers['authorization'] || req.body['token'];
        const token = authHeader && authHeader.split(' ')[1];
        const tokenData: any = await jwt.verify(token, secretKey);

        const {id} = tokenData;

        await getConnection()
            .createQueryBuilder()
            .delete()
            .from(Session)
            .where("userId = :id", {id: id})
            .execute();
    }

}

export const logoutService = new LogoutService();