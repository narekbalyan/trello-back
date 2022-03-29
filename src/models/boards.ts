export interface BoardsModel {
    id: string;
    user_id: string;
    owner_id: string;
    title: string;
    status: string;
    members_count: number,
    created: Date;
    updated: Date;
    lists: Array<string>;
}

export interface PostBoardBody {
    user_id: string;
    owner_id: string;
    title: string;
}

export interface PatchBoardBody {
    user_id?: string;
    owner_id?: string;
    title: string;
}

export interface PatchListOrderingBody {
    lists: Array<string>;
}