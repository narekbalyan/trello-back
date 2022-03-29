import {error_message, error_status} from './error.info';

export class ConflictException extends Error {
    message: string;
    status: number;

    constructor() {
        super();
        this.message = error_message.conflict;
        this.status = error_status.conflict;
    }
}