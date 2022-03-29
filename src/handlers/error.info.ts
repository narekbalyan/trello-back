export enum error_message {
    server_error = "Server Error",
    not_found = "Not found",
    deleted = "Already deleted",
    wrong_input = "Wrong input",
    expired = "Token expired",
    token_not_found = "Token does not exist",
    wrong_type_id = "Wrong type of id",
    wrong_password = "Invalid password",
    empty_password = "Empty password",
    empty_email = "Empty email",
    wrong_email = "Invalid Email",
    unauthorized = "Unauthorized",
    conflict = "Email already exist",
    invitation_error = "Invitation error",
    already_invited = "Already invited",
    not_allowed = "Unacceptable action"
}

export enum error_status {
    wrong_input = 400,
    unauthorized = 401,
    expired = 403,
    not_found = 404,
    not_allowed = 405,
    conflict = 409,
    server_error = 500
}
