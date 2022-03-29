import {error_message, error_status} from './error.info';

export class UnauthorizedException extends Error {
    message: string;
    status: number;

    constructor() {
        super();
        this.message = error_message.unauthorized;
        this.status = error_status.unauthorized;
    }
}