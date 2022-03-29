import {getRepository} from "typeorm";
import {Card} from "../entity/Cards";
import {List} from "../entity/Lists";
import {Comment} from "../entity/Comments";
import {Board} from "../entity/Boards";
import {Exception} from "../handlers/Exception";
import {error_message, error_status} from "../handlers/error.info";
import {validation} from "../handlers/validation";
import jwt from "jsonwebtoken";
import {PostListBody, PatchListBody, PatchCardOrderingBody} from "../models/lists"
import {NotFoundException} from "../handlers/NotFoundException";
import {ServerErrorException} from "../handlers/ServerErrorException";
import {WrongInputException} from "../handlers/WrongInputException";

class ListService {

    async getLists(req: any) {
        const authHeader: string = req.headers['Authorization'] || req.headers['authorization'] || req.body['token'];

        const token: string = authHeader && authHeader.split(' ')[1];

        const secret_key: string = process.env.SECRET_KEY as string;
        const tokenData: { exp: number, id: string } = await jwt.verify(token, secret_key) as { exp: number, id: string };

        const {id}: { id: string } = tokenData;

        const lists: Array<List> = await getRepository(List)
            .createQueryBuilder("list")
            .where("list.status = :status AND list.user_id = :user_id", {status: "active", user_id: id})
            .getMany();

        return lists;
    }

    async getListById(id: string) {
        validation.uuid_validation(id);
        const list: List | undefined = await getRepository(List).findOne(id);

        if (!list) {
            throw new NotFoundException();
        }
        if (list.status === "active") {
            return list;
        }
    }

    async createList(body: PostListBody) {
        const newList: List = await getRepository(List).create(body);
        newList.created = new Date();
        newList.status = "active";
        newList.cards = [];
        newList.title = newList.title?.trim();

        if (newList.board_id && newList.user_id && newList.title) {
            const board: Board = await getRepository(Board).findOne(newList.board_id) as Board;

            await getRepository(List).save(newList);

            board.lists.push(newList.id);

            await getRepository(Board).save(board)

            const saved_list = await getRepository(List).save(newList);

            if (!saved_list) {
                throw new ServerErrorException();
            }

            return {
                ...saved_list,
                owner_id: body.owner_id,
                user_id: body.user_id,
                board_id: body.board_id
            }

        } else {
            throw new ServerErrorException();
        }

    }

    async deleteList(id: string) {
        validation.uuid_validation(id);
        const list: List | undefined = await getRepository(List).findOne(id);
        if (!list) {
            throw new NotFoundException();
        }
        if (list.status === "deleted") {
            throw new Exception(error_message.deleted, error_status.not_found)
        }
        list.status = "deleted";

        const cards: Array<Card> = await getRepository(Card).createQueryBuilder("card")
            .where("card.list_id = :id AND card.status = :status", {id: id, status: "active"})
            .getMany();

        cards.forEach(card => {
            card.status = "deleted";
        })

        const comments: Array<Comment> = await getRepository(Comment).createQueryBuilder("comment")
            .where("comment.list_id = :id AND comment.status = :status", {id: id, status: "active"})
            .getMany();

        comments.forEach(comment => {
            comment.status = "deleted";
        })

        await getRepository(List).save(list);

        const board: Board = await getRepository(Board).findOne(list.board_id) as Board;

        const list_index = board.lists.indexOf(list.id);

        board.lists.splice(list_index, 1);

        await getRepository(Board).save(board);
        await getRepository(Card).save(cards);
        await getRepository(Comment).save(comments);
    }

    async editList(id: string, body: PatchListBody) {
        validation.uuid_validation(id);

        const listToUpdate: List = await getRepository(List).findOne(id) as List;

        listToUpdate.title = listToUpdate.title.trim();

        if (!listToUpdate) {
            throw new NotFoundException();
        }

        await getRepository(List).merge(listToUpdate, {updated: new Date()}, body);

        if (!listToUpdate.title) {
            throw new WrongInputException();
        }

        const saved_lists = await getRepository(List).save(listToUpdate);

        return {
            ...saved_lists,
            owner_id: body.owner_id,
            user_id: body.user_id,
            board_id: body.board_id
        }
    }

    async editCardOrdering(id: string, body: PatchCardOrderingBody) {
        validation.uuid_validation(id);

        const {orderingArr}: PatchCardOrderingBody = body;

        if (orderingArr.length === 1) {
            const listId: string = orderingArr[0].list_id;
            const list: List = await getRepository(List).findOne(listId) as List;
            list.cards = orderingArr[0].cardIds;

            await getRepository(List).save(list);
        } else {
            const listId: string = orderingArr[0].list_id;
            const list: List = await getRepository(List).findOne(listId) as List;
            list.cards = orderingArr[0].cardIds;

            await getRepository(List).save(list);

            const listId2: string = orderingArr[1].list_id;
            const list2: List = await getRepository(List).findOne(listId2) as List;
            list2.cards = orderingArr[1].cardIds;

            await getRepository(List).save(list2);
        }

    }

}

export const listService = new ListService();