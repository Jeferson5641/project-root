import { NotFoundException } from "@nestjs/common";

export class UserNotFoundException extends NotFoundException {
    constructor(email?: string) {
        const message = email
            ? `User not found for email: ${email}`
            : "User not found";
        super(message);
    }
}