import {error_message, error_status} from './error.info';

export class TokenExpiredException extends Error {
    message: string;
    status: number;

    constructor() {
        super();
        this.message = error_message.expired;
        this.status = error_status.expired;
    }
}