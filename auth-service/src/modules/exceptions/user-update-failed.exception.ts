import { BadRequestException } from "@nestjs/common"

export class UserUpdateFailedException extends BadRequestException {
    constructor(message?: string) {
        super(message || "Failed to update user.");
    }
}