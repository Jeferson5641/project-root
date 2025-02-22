import { NotFoundException } from "@nestjs/common";

export class UserNotFoundException extends NotFoundException {
    constructor(identifier?: string | number) {
        const message = identifier
            ? `User not found for identifier: ${identifier}`
            : "User not found";
        super(message);
    }
}