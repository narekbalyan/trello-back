import bcrypt from 'bcrypt';
import {User} from '../entity/Users';
import {getRepository} from "typeorm";
import {error_message, error_status} from '../handlers/error.info';
import {Exception} from '../handlers/Exception';
import {validation} from "../handlers/validation";
import jwt from "jsonwebtoken";
import {Board} from '../entity/Boards';
import nodemailer from "nodemailer";
import {PatchBoardOrderingBody, PatchUserBody} from '../models/users';
import {NotFoundException} from '../handlers/NotFoundException';

class UserService {

    async getUsers() {
        const users: Array<User> = await getRepository(User)
            .createQueryBuilder("user")
            .where("user.status = :status", {status: "active"})
            .getMany();

        return users;
    }

    async getUserById(id: string) {
        validation.uuid_validation(id);
        const user: User | undefined = await getRepository(User).findOne(id);
        if (!user) {
            throw new NotFoundException();
        }

        if (user.status !== "deleted") {
            return user;
        }

    }

    async deleteUser(id: string) {
        validation.uuid_validation(id);
        const user: User | undefined = await getRepository(User).findOne(id);

        if (!user) {
            throw new NotFoundException();
        }
        if (user.status === "deleted") {
            throw new Exception(error_message.deleted, error_status.not_found)
        }

        user.status = 'deleted';

        await getRepository(User).save(user);

    }

    async editUser(id: string, body: PatchUserBody) {
        validation.uuid_validation(id);

        const userToUpdate: User | undefined = await getRepository(User).createQueryBuilder("user")
            .where("user.id = :id AND user.status = :status ", {id: id, status: 'active'})
            .getOne();

        if (!userToUpdate) {
            throw new NotFoundException();
        }

        userToUpdate.updated = new Date();

        const {oldPassword, newPassword}: PatchUserBody = body;

        if (!(newPassword && oldPassword)) {
            throw new Exception(error_message.empty_password, error_status.unauthorized);
        }

        validation.password_validation(newPassword);

        const passwordCheck: boolean = await bcrypt.compare(oldPassword, userToUpdate.password);

        if (!passwordCheck) {
            throw new Exception(error_message.empty_password, error_status.unauthorized)
        }

        const new_hashed_pass: string = await bcrypt.hash(newPassword, 10);
        userToUpdate.password = new_hashed_pass;

        await getRepository(User).save(userToUpdate);

    }

    async inviteUser(req: any) {
        const secret_key: string = process.env.SECRET_KEY as string;
        const invitation_email = req.body.email;
        const invite_board_id = req.body.board_id;
        const authHeader: string = req.headers['authorization'] || req.headers['Authorization'] || req.body['token'];

        const our_email = process.env.EMAIL || "trello_team_a_public@outlook.com";
        const our_password = process.env.EMAIL_PASSWORD || "public_password";

        validation.email_validation(invitation_email);

        if (!(invitation_email && invite_board_id)) {
            throw new NotFoundException();
        }

        const token: string = authHeader && authHeader.split(' ')[1];

        const invited_user: any = await getRepository(User)
            .createQueryBuilder("user")
            .where("user.email = :email", {email: invitation_email})
            .getOne();

        if (!invited_user) {
            throw new Exception("Email didn't exist", 404);
        }

        const check: Boolean = invited_user.membership.includes(invite_board_id);

        // checking for inviting yourself
        const jwt_check: any = await jwt.verify(token, secret_key)

        const {id}: { id: string } = jwt_check;

        const inviter: any = await getRepository(User)
            .createQueryBuilder("user")
            .where("user.id = :id", {id: id})
            .getOne();

        if (invitation_email === inviter.email) {
            throw new Exception(error_message.invitation_error, error_status.conflict)
        }

        // check user already in this board
        if (check) {
            throw new Exception(error_message.already_invited, error_status.conflict)
        }

        invited_user.membership.push(invite_board_id);
        invited_user.boards.push(invite_board_id);

        const board: any = await getRepository(Board).findOne(invite_board_id);

        board.members_count += 1

        await getRepository(User).save(invited_user);
        await getRepository(Board).save(board);

        const transporter = nodemailer.createTransport({
            host: "smtp-mail.outlook.com",
            port: 587,
            secure: false,
            auth: {
                user: our_email,
                pass: our_password,
            }
        })

        const message = {
            from: our_email,
            to: `${invitation_email}`,
            subject: "Invite in new board",
            html: `<div><h1>Trello Group a</h1><p style="font-size: 18px">Hey <strong>${invited_user.user_name}</strong>. You are invited in <i>${inviter.user_name}'s</i> board.</p><img src="https://t4.ftcdn.net/jpg/02/87/58/53/360_F_287585365_Frif6YALlDhXdo03m9DfHJ5hlu4kj3Fp.jpg" alt="invite picture"></div>`
        }

        const mailer = (message: object) => {
            transporter.sendMail(message, (err, info) => {
                if (err) console.log(err.message);
                console.log('Email sent: ', info)
            })
        }

        mailer(message)

    }

    async editBoardOrdering(id: string, body: PatchBoardOrderingBody) {
        validation.uuid_validation(id);

        const {boards}: PatchBoardOrderingBody = body;

        const currentUser: User = await getRepository(User).findOne(id) as User;
        currentUser.boards = boards;

        await getRepository(User).save(currentUser);

        return {
            boards,
            user_id: id
        }

    }
}

export const userService = new UserService();