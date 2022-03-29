import {NextFunction, Response} from "express";
import {Exception} from "../handlers/Exception";
import jwt from "jsonwebtoken";
import {getRepository} from "typeorm";
import {User} from "../entity/Users";
import {error_message, error_status} from "../handlers/error.info";
import {responseJsonHandler} from "../handlers/errorHandler";
import {Session} from "../entity/Session";
import {UnauthorizedException} from "../handlers/UnauthorizedException";
import {NotFoundException} from "../handlers/NotFoundException";
import {TokenExpiredException} from "../handlers/TokenExpiredException";

export async function jwtVerify(req: any, res: Response, next: NextFunction) {

    if (checkUrlMatching(req.url)) {
        return next();
    }

    try {
        const authHeader: string = req.headers['authorization'] || req.headers['Authorization'] || req.body['token'];

        if (!authHeader) {
            throw new UnauthorizedException();
        }

        const token: string  = authHeader && authHeader.split(' ')[1]; 

        if (!token) {
            throw new UnauthorizedException();
        }

        const secret_key: string = process.env.SECRET_KEY as string;
        const tokenData:  {exp: number, id: string } = await jwt.verify(token, secret_key) as  {exp: number, id: string };

        if (!tokenData) {
            throw new Exception(error_message.token_not_found, error_status.unauthorized);
        }

        const session_check =  await getRepository(Session).createQueryBuilder('session')
            .where("session.userId = :userId", {userId: tokenData.id})
            .getOne();

        if (!session_check) {
            tokenData.exp = 0;
        }

        const {exp, id}: {exp: number, id: string } = tokenData;

        const user: User | undefined = await getRepository(User).findOne(id);

        if (!user) {
            throw new NotFoundException();
        }

        const now: number = Math.floor(Date.now() / 1000);

        if (now > exp) {
            throw new TokenExpiredException();
        }

        if (user.status === "deleted") {
            throw new Exception(`user is ${user.status}`, 401);
        }

        next();
    } catch (error: any) {
        responseJsonHandler(new Exception(error.message, error.status), null, res);
    }

}


function checkUrlMatching(url: string): boolean {
    const nonTokenizedUrls = ['/register', '/login', '/docs'];
    const actualUrl = url.replace('/api', '');
    let hasMatched = false;

    for (const key in nonTokenizedUrls) {
        if (actualUrl === nonTokenizedUrls[key]) {
            hasMatched = true;
            break;
        }
    }

    return hasMatched;
}