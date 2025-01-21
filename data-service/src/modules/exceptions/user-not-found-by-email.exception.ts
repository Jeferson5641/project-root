import { NotFoundException } from '@nestjs/common';

export class UserNotFoundByEmailException extends NotFoundException {
    constructor(email: string) {
        super(`User with email '${email}' not found.`);
    }
}
