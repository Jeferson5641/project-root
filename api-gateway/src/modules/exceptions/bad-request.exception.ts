import { HttpException, HttpStatus } from "@nestjs/common";

export class BadRequestException extends HttpException {
    constructor(message = 'Invalid payload') {
        super(message, HttpStatus.BAD_REQUEST);
    }
}