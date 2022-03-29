import {error_message, error_status} from './error.info';

export class ServerErrorException extends Error {
    message: string;
    status: number;

    constructor() {
        super();
        this.message = error_message.server_error;
        this.status = error_status.server_error;
    }
}
