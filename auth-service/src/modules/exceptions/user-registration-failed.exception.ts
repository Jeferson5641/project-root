import { BadRequestException } from "@nestjs/common";

export class UserRegistrationFailedException extends BadRequestException {
    constructor(message?: string, reason?: string) {
        const fullMessage = reason ? `${message || 'User registration failed'} - Reason: ${reason}` : message || 'User registration failed';
        super(fullMessage);
    }
}