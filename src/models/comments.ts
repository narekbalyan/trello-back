export interface CommentsModel {
    id: string;
    card_id: string;
    user_id: string;
    board_id: string;
    list_id: string;
    creator_id: string;
    context: string;
    status: string;
    created: Date;
    updated: Date;
    user_name?: string;
}

export interface PostCommentBody {
    card_id: string;
    user_id: string;
    context: string;
}

export interface PatchCommentBody {
    context: string;
    user_id?: string;
    owner_id?: string;
    board_id?: string;
    card_id?: string;
}