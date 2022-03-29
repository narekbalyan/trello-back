import {Exception} from "./Exception";
import {error_message, error_status} from "./error.info";
import "password-validator";
import PasswordValidator from "password-validator";
import validator from 'validator';

class Validation {

    uuid_validation(id: string) {
        const isValidUUID = validator.isUUID(id);
        if (!isValidUUID) {
            throw new Exception(error_message.wrong_type_id, error_status.not_found)
        }
    }

    email_validation(email: string) {
        const isValidEmail: boolean = validator.isEmail(email);

        if (!isValidEmail) {
            throw new Exception(error_message.wrong_email, error_status.not_found);
        }

    }

    password_validation(password: string) {
        const schema = new PasswordValidator();

        schema
            .is().min(5)
            .has().uppercase()
            .has().lowercase()
            .has().symbols()
            .has().digits()
            .has().not().spaces()

        const validate: Array<string> = schema.validate(password, { list: true }) as Array<string>;

        const json_error_messages: string = JSON.stringify(validate);

        if (validate.length > 0) {
            throw new Exception(json_error_messages, error_status.conflict);
        }

    }
}

export const validation = new Validation();
