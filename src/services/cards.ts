import "reflect-metadata";
import {getRepository} from "typeorm";
import {Card} from "../entity/Cards";
import {Comment} from "../entity/Comments";
import {List} from "../entity/Lists";
import {error_message, error_status} from "../handlers/error.info";
import {Exception} from "../handlers/Exception";
import {validation} from "../handlers/validation";
import jwt from "jsonwebtoken";
import {PostCardBody, PatchCardBody} from "../models/cards";
import {NotFoundException} from "../handlers/NotFoundException";
import {ServerErrorException} from "../handlers/ServerErrorException";
import {WrongInputException} from "../handlers/WrongInputException";

class CardService {

    async getCards(req: any) {
        const authHeader: string = req.headers['Authorization'] || req.headers['authorization'] || req.body['token'];

        const token: string = authHeader && authHeader.split(' ')[1];

        const secret_key: string = process.env.SECRET_KEY as string;
        const tokenData: { exp: number, id: string } = await jwt.verify(token, secret_key) as { exp: number, id: string };

        const {id}: { id: string } = tokenData;

        const cards: Array<Card> = await getRepository(Card)
            .createQueryBuilder("card")
            .where("card.status = :status AND card.user_id = :user_id", {status: "active", user_id: id})
            .getMany();

        return {
            ...cards,
            list_id: req.body.list_id,
            user_id: req.body.user_id,
            board_id: req.body.board_id,
        };
    }

    async getCardById(id: string) {
        validation.uuid_validation(id);
        const card: Card | undefined = await getRepository(Card).findOne(id);
        if (!card) {
            throw new NotFoundException();
        }

        if (card.status === "active") {
            return card
        }
    }

    async createCard(body: PostCardBody) {
        const newCard: Card = await getRepository(Card).create(body);
        newCard.created = new Date();
        newCard.status = "active";
        newCard.title = newCard.title?.trim();

        if (!(newCard.board_id && newCard.user_id && newCard.title && newCard.list_id)) {
            throw new ServerErrorException();
        }

        newCard.listId = newCard.list_id;

        await getRepository(Card).save(newCard);

        const list: List = await getRepository(List).findOne(newCard.list_id) as List;

        list.cards.push(newCard.id)

        await getRepository(List).save(list);

        const created_card = await getRepository(Card).save(newCard);

        return {
            ...created_card,
            owner_id: body.owner_id,
            user_id: body.user_id,
            board_id: body.board_id,
            list_id: body.list_id
        }
    }

    async deleteCard(id: string) {
        validation.uuid_validation(id);
        const card: Card | undefined = await getRepository(Card).findOne(id);
        if (!card) {
            throw new NotFoundException();
        }

        if (card.status === "deleted") {
            throw new Exception(error_message.deleted, error_status.not_found)
        }

        card.status = 'deleted';
        const comment: Array<Comment> = await getRepository(Comment)
            .createQueryBuilder('comments')
            .where("comments.card_id = :id", {id: id})
            .getMany();

        comment.forEach(currentComment => {
            currentComment.status = 'deleted';
        });

        const list: List = await getRepository(List).findOne(card.list_id) as List;

        await getRepository(Card).save(card);
        const card_index: number = list.cards.indexOf(id);
        list.cards.splice(card_index, 1);

        await getRepository(List).save(list);
        await getRepository(Comment).save(comment);

    }

    async editCard(id: string, body: PatchCardBody) {
        validation.uuid_validation(id);
        const editableCard: Card = await getRepository(Card).findOne(id) as Card;
        if (!editableCard) {
            throw new NotFoundException();
        }

        await getRepository(Card).merge(editableCard, body);
        editableCard.updated = new Date();
        editableCard.title = editableCard.title.trim();

        if (!editableCard.title) {
            throw new WrongInputException();
        }

        const edited_card = await getRepository(Card).save(editableCard);

        return {
            ...edited_card,
            owner_id: body.owner_id,
            user_id: body.user_id,
            board_id: body.board_id,
            list_id: body.list_id
        }
    }
}

export const cardService = new CardService();