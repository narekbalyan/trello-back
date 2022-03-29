export interface ListsModel {
    id: string;
    board_id: string;
    user_id: string;
    title: string;
    status: string;
    created: Date;
    updated: Date;
    cards:  Array<string>;
}

export interface PostListBody {
    board_id: string;
    user_id: string;
    title: string;
    owner_id?: string;
}

export interface PatchListBody {
    board_id?: string;
    user_id?: string;
    owner_id?: string;
    title: string;
}

interface OrderingArrayModel {
    cardIds: Array<string>;
    list_id: string;
}

export interface PatchCardOrderingBody {
    orderingArr: Array<OrderingArrayModel>;
}