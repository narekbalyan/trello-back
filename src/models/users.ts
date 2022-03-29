export interface UsersModel {
    id: string;
    user_name: string;
    password: string;
    email: string;
    status: string;
    created: Date;
    updated: Date;
    membership: Array<string>;
    boards: Array<string>;
}

export interface PatchUserBody {
    oldPassword: string;
    newPassword: string;
}

export interface PatchBoardOrderingBody {
    boards: Array<string>;
}