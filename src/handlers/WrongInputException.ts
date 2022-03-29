import {error_message, error_status} from './error.info';

export class WrongInputException extends Error {
    message: string;
    status: number;

    constructor() {
        super();
        this.message = error_message.wrong_input;
        this.status = error_status.wrong_input;
    }
}