import {getRepository} from "typeorm";
import {User} from "../entity/Users";
import {Exception} from "../handlers/Exception";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import {error_message, error_status} from "../handlers/error.info";
import {Session} from "../entity/Session";
import {LoginBody} from "../models/login";

dotenv.config();

class LoginService {
    async loginService(body: LoginBody) {
        const secretKey: string = process.env.SECRET_KEY || 'dummySecretKey';
        const {email, password}: LoginBody = body;

        const current_user: any = await getRepository(User).createQueryBuilder('user')
            .where("user.email = :email", {email: email})
            .getOne() as User;

        if (!current_user) {
            throw new Exception(JSON.stringify([error_message.wrong_email]), error_status.not_found)
        }

        const isPassMatched: boolean = await bcrypt.compare(password, current_user.password);

        if (!isPassMatched) {
            throw new Exception(JSON.stringify([error_message.wrong_password]), error_status.not_found)
        }
        const userId = current_user.id;
        const current_user_id: object = {id: userId};

        const accessToken: string = jwt.sign(current_user_id, secretKey, {
            expiresIn: process.env.EXPIRATION_TIME,
        });

        current_user.status = "active";

        delete current_user.password;

        const userid_in_session = await getRepository(Session).createQueryBuilder('session')
            .where("session.userId = :userId", {userId: userId})
            .getOne();

        if (!userid_in_session) {
            const session = await getRepository(Session).create();
            session.userId = userId;
            await getRepository(Session).save(session);
            await getRepository(User).save(current_user); // save status change bug fix
        }

        return {
            ...current_user,
            token: accessToken
        };
    }
}

export const loginService = new LoginService();