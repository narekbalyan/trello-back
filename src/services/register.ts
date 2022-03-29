import bcrypt from 'bcrypt';
import {User} from '../entity/Users';
import {getRepository} from "typeorm";
import {Board} from '../entity/Boards';
import {List} from '../entity/Lists';
import {error_message, error_status} from '../handlers/error.info';
import {Exception} from '../handlers/Exception';
import {validation} from "../handlers/validation";
import nodemailer from "nodemailer";
import {RegisterBody} from '../models/register';
import {ServerErrorException} from '../handlers/ServerErrorException';

class RegisterService {
    async register(body: RegisterBody) {
        const our_email = process.env.EMAIL || "trello_team_a_public@outlook.com";
        const our_password = process.env.EMAIL_PASSWORD || "public_password";

        const {user_name, email, password}: RegisterBody = body;

        validation.email_validation(email);
        validation.password_validation(password);

        const checked_user = await getRepository(User).createQueryBuilder('user')
            .where("user.email = :current_email", {current_email: email})
            .getOne();

        if (checked_user?.status === "active" || checked_user?.status === "inactive") {
            throw new Exception(JSON.stringify([error_message.conflict]), error_status.conflict)
        }

        const hashedPassword: string = await bcrypt.hash(password, 10);
        const credentials: object = {user_name, email, password: hashedPassword};
        const newUser: User = await getRepository(User).create(credentials);

        newUser.status = 'inactive';
        newUser.created = new Date();
        newUser.membership = [];
        newUser.boards = [];
        newUser.user_name = newUser.user_name?.trim()

        if (!(newUser.user_name && newUser.password && newUser.email)) {
            throw new ServerErrorException();
        }

        await getRepository(User).save(newUser);

        const currentUser: any = await getRepository(User).createQueryBuilder("user")
            .where("user.email = :email", {email: email})
            .getOne();

        const currentUserId = currentUser?.id;

        const board_layout = {
            title: "Default board",
            user_id: currentUserId,
            owner_id: currentUserId,
            lists: [],
            created: new Date(),
            status: 'active',
            members_count: 1
        }

        const default_board: Board = await getRepository(Board).create(board_layout);

        const saved_board = await getRepository(Board).save(default_board);

        currentUser.boards.push(saved_board.id);
        currentUser.membership.push(saved_board.id);

        await getRepository(User).save(currentUser);

        const current_board_id: string = saved_board.id;

        const list_layout = {
            user_id: currentUserId,
            board_id: current_board_id,
            title: '',
            status: 'active',
            created: new Date(),
            cards: []
        };

        const list_names: Array<string> = ["To do", "Doing", "Done"];

        for (const name of list_names) {
            list_layout.title = name;
            const list: List = await getRepository(List).create(list_layout);
            await getRepository(List).save(list);
            default_board.lists.push(list.id);
            await getRepository(Board).save(default_board);
        }

        const transporter = nodemailer.createTransport({
            host: 'smtp-mail.outlook.com',
            port: 587,
            secure: false,
            auth: {
                user: our_email,
                pass: our_password,
            }
        })

        const message = {
            from: our_email,
            to: `${newUser.email}`,
            subject: "Welcome from Group a",
            html: `<div><h1>Welcome to Trello by Group a</h1><p style="font-size: 18px">Hey <strong>${newUser.user_name}</strong>, happy to see you in our application.</p><img src="https://st3.depositphotos.com/1010735/14784/v/600/depositphotos_147849195-stock-illustration-welcome-banner-with-colorful-confetti.jpg" alt="welcome picture"></div>`
        }

        const mailer = (message: object) => {
            transporter.sendMail(message, (err, info) => {
                if (err) console.log(err.message);
                console.log('Email sent: ', info)
            })
        }

        mailer(message)
    }
}

export const registerService = new RegisterService();