import "reflect-metadata";
import {getRepository} from "typeorm";
import {Board} from "../entity/Boards"
import {Card} from "../entity/Cards";
import {List} from "../entity/Lists";
import {Comment} from "../entity/Comments"
import {Exception} from "../handlers/Exception";
import {error_message, error_status} from "../handlers/error.info";
import {validation} from "../handlers/validation";
import jwt from "jsonwebtoken";
import {User} from "../entity/Users";
import {PostBoardBody, PatchBoardBody, PatchListOrderingBody} from "../models/boards";
import {NotFoundException} from "../handlers/NotFoundException";
import {ServerErrorException} from "../handlers/ServerErrorException";
import {WrongInputException} from "../handlers/WrongInputException";
import {NotAllowedException} from "../handlers/NotAllowedException";
import { CommentsModel } from "../models/comments";
import { CardsModel } from "../models/cards";
import { ListsModel } from "../models/lists";
import { UsersModel } from "../models/users";

class BoardService {

    async getBoards(req: any) {
        const authHeader: string = req.headers['authorization'] || req.headers['Authorization'] || req.body['token'];

        const token: string = authHeader && authHeader.split(' ')[1];

        const secret_key: string = process.env.SECRET_KEY as string;
        const tokenData: { exp: number, id: string } = await jwt.verify(token, secret_key) as { exp: number, id: string };

        const {id}: { id: string } = tokenData;

        const user: any = await getRepository(User).findOne(id);

        const ordered_boards: any = user?.boards;

        const boards: any = await getRepository(Board)
            .createQueryBuilder("board")
            .where("board.status = :status AND board.user_id = :user_id", {status: "active", user_id: id})
            .getMany();

        if (!user) {
            throw new NotFoundException();
        }

        for (const item of user.membership) {
            const member_board = await getRepository(Board).findOne(item);
            boards.push(member_board)
        }
        await getRepository(Board).save(boards)

        const sorted_boards: Array<object> = [];

        ordered_boards.forEach((id: any) => {
            const foundBoards = boards.find((board: any) => board.id === id);
            if (foundBoards) {
                sorted_boards.push(foundBoards);
            }
        })

        return sorted_boards.map((item: any) => {
            return {
                board_id: item.id,
                board_title: item.title,
                owner_id: item.owner_id
            }
        })

    }

    async getBoardById(board_id: string, req: any) {

        validation.uuid_validation(board_id)

        const authHeader: string = req.headers['authorization'] || req.headers['Authorization'] || req.body['token'];

        const token: string = authHeader && authHeader.split(' ')[1];

        const secret_key: string = process.env.SECRET_KEY as string;
        const tokenData: { exp: number, id: string } = await jwt.verify(token, secret_key) as { exp: number, id: string };

        const {id}: { id: string } = tokenData;

        const cards: Array<Card> = await getRepository(Card).createQueryBuilder("card")
            .where("card.board_id = :id AND card.status = :status", {id: board_id, status: "active"})
            .getMany();


        const lists: Array<List> = await getRepository(List).createQueryBuilder("list")
            .where("list.board_id = :id AND list.status = :status", {id: board_id, status: "active"})
            .getMany();

        const board: Board | undefined = await getRepository(Board).createQueryBuilder("board")
            .where("board.id = :id AND board.status = :status", {id: board_id, status: "active"})
            .getOne();

        if (!board) {
            throw new NotFoundException();
        }

        return {
            user_id: id,
            board_id: board_id,
            cards,
            lists,
            ordered_lists: board.lists,
            members_count: board.members_count
        };

    }

    async createBoard(body: PostBoardBody) {
        const boardToCreate: Board = await getRepository(Board).create(body);
        boardToCreate.created = new Date();
        boardToCreate.status = "active";
        boardToCreate.lists = [];
        boardToCreate.members_count = 1;
        boardToCreate.title = boardToCreate.title?.trim();


        if (!(boardToCreate.title && boardToCreate.user_id && boardToCreate.owner_id && (boardToCreate.user_id === boardToCreate.owner_id))) {
            throw new ServerErrorException();
        }

        const saved_board = await getRepository(Board).save(boardToCreate);

        const currentUser: any = await getRepository(User).findOne(boardToCreate.user_id);

        currentUser.boards.push(saved_board.id);
        currentUser.membership.push(saved_board.id);

        await getRepository(User).save(currentUser);

        if (!saved_board) {
            throw new ServerErrorException();
        }

        return {
            ...saved_board
        }
    }

    async deleteBoard(board_id: string, req: any) {
        validation.uuid_validation(board_id);

        const authHeader: string = req.headers['Authorization'] || req.headers['authorization'] || req.body['token'];

        const token: string = authHeader && authHeader.split(' ')[1];

        const secret_key: string = process.env.SECRET_KEY as string;

        const tokenData: { id: string } = await jwt.verify(token, secret_key) as { id: string };

        const {id}: { id: string } = tokenData;

        const board: Board | undefined = await getRepository(Board).findOne(board_id);

        if (!board) {
            throw new NotFoundException();
        }
        if (board.status === "deleted") {
            throw new Exception(error_message.deleted, error_status.not_found)
        }

        const lists: Array<ListsModel> = await getRepository(List).createQueryBuilder("list")
            .where("list.board_id = :id AND list.status = :status", {id: board_id, status: "active"})
            .getMany();

        const cards: Array<CardsModel> = await getRepository(Card).createQueryBuilder("card")
            .where("card.board_id = :id AND card.status = :status", {id: board_id, status: "active"})
            .getMany();

        const comments: Array<CommentsModel> = await getRepository(Comment).createQueryBuilder("comment")
            .where("comment.board_id = :id AND comment.status = :status", {id: board_id, status: "active"})
            .getMany();

        if (id !== board.owner_id) {
            throw new NotAllowedException()
        }

        const users: Array<UsersModel> = await getRepository(User).createQueryBuilder("user")
        .where("user.status = :active_status OR user.status = :inactive_status", {active_status: "active", inactive_status: "inactive"})
        .getMany();

        users.forEach(user => {
            let boardMemberIndex = user.membership.indexOf(board_id)
            let boardIndex = user.membership.indexOf(board_id)
            if (boardMemberIndex >= 0) {
                user.membership.splice(boardMemberIndex, 1);
            }
            if (boardIndex >= 0) {
                user.boards.splice(boardMemberIndex, 1);
            }
        })

        cards.forEach(card => {
            card.status = "deleted";
        });

        lists.forEach(list => {
            list.status = "deleted";
        });

        comments.forEach(comment => {
            comment.status = "deleted";
        });

        board.status = "deleted";

        await getRepository(Card).save(cards);
        await getRepository(List).save(lists);
        await getRepository(Comment).save(comments);
        await getRepository(Board).save(board);
    }

    async editBoard(id: string, body: PatchBoardBody) {
        validation.uuid_validation(id);
        const boardToUpdate: Board = await getRepository(Board).findOne(id) as Board;

        if (!boardToUpdate) {
            throw new NotFoundException();
        }

        boardToUpdate.updated = new Date();
        await getRepository(Board).merge(boardToUpdate, body);

        boardToUpdate.title = boardToUpdate.title.trim();

        if (!boardToUpdate.title) {
            throw new WrongInputException();
        }
        const changed_board = await getRepository(Board).save(boardToUpdate);

        return {
            ...changed_board,
            owner_id: body.owner_id,
            user_id: body.user_id
        }

    }

    async orderLists(id: string, body: PatchListOrderingBody) {
        validation.uuid_validation(id);
        const board: Board = await getRepository(Board).findOne(id) as Board;

        const {lists}: any = body;
        board.lists = lists;

        await getRepository(Board).save(board);

        return {
            lists: lists,
            board_id: id
        }
    }

    async leaveBoard(req: any) {
        const authHeader: string = req.headers['authorization'] || req.headers['Authorization'] || req.body['token'];

        const token: string = authHeader && authHeader.split(' ')[1];

        const secret_key: string = process.env.SECRET_KEY as string;
        const tokenData: { exp: number, id: string } = await jwt.verify(token, secret_key) as { exp: number, id: string };

        const {id}: { id: string } = tokenData;

        const {board_id, owner_id} = req.body

        const board_leaver = await getRepository(User).findOne(id);

        if (!board_leaver) {
            throw new NotFoundException();
        }

        const board_leaver_membership = board_leaver?.membership;
        const board_leaver_boards = board_leaver?.boards;

        const membership_index = board_leaver_membership?.indexOf(board_id);
        const board_index = board_leaver_boards?.indexOf(board_id);

        if (owner_id === id) {
            throw new NotAllowedException();
        }


        if (membership_index === -1 || board_index === -1) {
            throw new NotFoundException();
        }

        board_leaver_membership?.splice(membership_index, 1);
        board_leaver_boards?.splice(board_index, 1);

        await getRepository(User).save(board_leaver);

        const board: any = await getRepository(Board).findOne(board_id);

        board.members_count -= 1

        await getRepository(Board).save(board)
    }
}

export const boardService = new BoardService();