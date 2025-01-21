import { NotFoundException } from '@nestjs/common';

export class UserNotFoundByIdException extends NotFoundException {
    constructor(id: number) {
        super(`User with ID ${id} not found.`);
    }
}
