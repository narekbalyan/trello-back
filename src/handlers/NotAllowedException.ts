import {error_message, error_status} from './error.info';

export class NotAllowedException extends Error {
    message: string;
    status: number;

    constructor() {
        super();
        this.message = error_message.not_allowed;
        this.status = error_status.not_allowed;
    }
}