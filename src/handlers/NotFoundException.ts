import {error_message, error_status} from './error.info';

export class NotFoundException extends Error {
    message: string;
    status: number;

    constructor() {
        super();
        this.message = error_message.not_found;
        this.status = error_status.not_found;
    }
}