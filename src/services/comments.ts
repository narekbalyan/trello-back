import {getRepository} from "typeorm";
import {Comment} from "../entity/Comments";
import {error_message, error_status} from "../handlers/error.info";
import {Exception} from "../handlers/Exception";
import {validation} from "../handlers/validation";
import jwt from "jsonwebtoken";
import {PostCommentBody, PatchCommentBody, CommentsModel} from "../models/comments"
import {NotFoundException} from "../handlers/NotFoundException";
import {ServerErrorException} from "../handlers/ServerErrorException";
import {WrongInputException} from "../handlers/WrongInputException";
import {User} from "../entity/Users";

class CommentService {

    async getComments(req: any) {
        const authHeader: string = req.headers['Authorization'] || req.headers['authorization'] || req.body['token'];

        const token: string = authHeader && authHeader.split(' ')[1];

        const secret_key: string = process.env.SECRET_KEY as string;
        const tokenData: { exp: number, id: string } = await jwt.verify(token, secret_key) as { exp: number, id: string };
        const {id}: { id: string } = tokenData;
        const card_id: string = req.headers["card_id"];

        const comments: Array<CommentsModel> = await getRepository(Comment)
            .createQueryBuilder("comment")
            .where("comment.status = :status AND comment.card_id = :card_id", {status: "active", card_id: card_id})
            .getMany();

        for (const comment of comments) {
            const current_comment_creator = comment.creator_id;
            const user = await getRepository(User).findOne(current_comment_creator);

            comment.user_name = user?.user_name
        }

        return {
            comments,
            card_id,
            user_id: id
        };
    }

    async getCommentById(id: string) {
        validation.uuid_validation(id);

        const comment: Comment | undefined = await getRepository(Comment).findOne(id);

        if (!comment) {
            throw new NotFoundException();
        }
        if (comment.status === "active") {
            return comment;
        }
    }

    async createComment(body: PostCommentBody) {
        const newComment: Comment = await getRepository(Comment).create(body);
        newComment.created = new Date();
        newComment.status = "active";
        newComment.creator_id = newComment.user_id;
        newComment.context = newComment.context?.trim();

        if (!(newComment.user_id && newComment.card_id && newComment.context)) {
            throw new ServerErrorException();
        }

        const saved_comment = await getRepository(Comment).save(newComment);

        const current_user: User | undefined = await getRepository(User).createQueryBuilder("user")
            .where("id = :user_id", {user_id: newComment.user_id})
            .getOne();

        if (!current_user) {
            throw new NotFoundException()
        }

        return {
            ...saved_comment,
            user_id: newComment.user_id,
            owner_id: newComment.user_id,
            board_id: newComment.board_id,
            card_id: newComment.card_id,
            user_name: current_user?.user_name
        }
    }

    async deleteComment(id: string) {
        validation.uuid_validation(id);

        const comment: Comment | undefined = await getRepository(Comment).findOne(id);

        if (!comment) {
            throw new NotFoundException();
        }
        if (comment.status === "deleted") {
            throw new Exception(error_message.deleted, error_status.not_found);
        }

        comment.status = "deleted";

        await getRepository(Comment).save(comment);
    }

    async editComment(id: string, body: PatchCommentBody) {
        const editableComment: Comment = await getRepository(Comment).findOne(id) as Comment;

        if (!editableComment) {
            throw new NotFoundException();
        }

        await getRepository(Comment).merge(editableComment, body);


        editableComment.context = editableComment.context.trim()

        if (!editableComment.context) {
            throw new WrongInputException();
        }

        editableComment.updated = new Date();

        const edited_comments = await getRepository(Comment).save(editableComment);

        return {
            ...edited_comments,
            user_id: body.user_id,
            owner_id: body.user_id,
            board_id: body.board_id,
            card_id: body.card_id
        }
    }
}

export const commentService = new CommentService();