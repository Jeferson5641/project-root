import { HttpException, HttpStatus } from "@nestjs/common";

export class NotFoundException extends HttpException {
    constructor(message = 'Route not found') {
        super(message, HttpStatus.NOT_FOUND);
    }
}