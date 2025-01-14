import { BadRequestException } from "@nestjs/common";

export class UserRegistrationFailedException extends BadRequestException {
    constructor(message?: string) {
        super(message || 'User registration failed');
    }
}