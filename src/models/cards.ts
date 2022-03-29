export interface CardsModel {
    id: string;
    user_id: string;
    board_id: string;
    list_id: string;
    listId: string;
    title: string;
    description: string;
    estimate: number;
    status: string;
    created: Date;
    updated: Date;
}

export interface PostCardBody {
    user_id: string;
    board_id: string;
    list_id: string;
    title: string;
    owner_id?: string;
}

export interface PatchCardBody {
    title: string;
    description?: string;
    estimate?: number;
    user_id?: string;
    board_id?: string;
    list_id?: string;
    owner_id?: string;
}